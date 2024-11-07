import { VercelRequest, VercelResponse } from '@vercel/node';
import createDebug from 'debug';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import axios from 'axios';

const debug = createDebug('bot:dev');

const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
const VERCEL_URL = `${process.env.VERCEL_URL}`;
const TCKEY = process.env.TCKEY || '';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const md5 = require('md5');


const production = async (
  req: VercelRequest,
  res: VercelResponse,
  bot: Telegraf<Context<Update>>,
) => {
  debug('Bot runs in production mode');
  debug(`setting webhook: ${VERCEL_URL}`);

  if (!VERCEL_URL) {
    throw new Error('VERCEL_URL is not set.');
  }

  if (req.url?.substring(0, 9) == '/api/send') {
    const text = req.query?.text || req.body?.text || '';
    const sendkey = req.query?.sendkey || req.body?.sendkey || '';
    const desp = req.query?.desp || req.body?.desp || '';
    const markdown = req.query?.markdown || req.body?.markdown || '';

    if (text == '' || sendkey == '') {
      throw new Error('text & sendkey cannot be empty');
    } else {
      const key_info: String[] = String(sendkey).split('T');

      if (key_info[1] != md5(TCKEY + key_info[0])) {
        throw new Error('sendkey error');
      } else {
        var params = new URLSearchParams();
        params.append('chat_id', String(key_info[0]));
        let content = String(text) + '\n\n' + String(desp);
        if (markdown != '') {
          content += String(markdown);
          params.append('parse_mode', 'MarkdownV2');
        }

        params.append('text', content);

        const ret = await axios.post(
          'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage',
          params,
        );
        res.status(200).json(ret.data);
      }
    }
  }

  const getWebhookInfo = await bot.telegram.getWebhookInfo();
  if (getWebhookInfo.url !== VERCEL_URL + '/api') {
    debug(`deleting webhook ${VERCEL_URL}`);
    await bot.telegram.deleteWebhook();
    debug(`setting webhook: ${VERCEL_URL}/api`);
    await bot.telegram.setWebhook(`${VERCEL_URL}/api`);
  }

  if (req.method === 'POST') {
    await bot.handleUpdate(req.body as unknown as Update, res);
  } else {
    res.status(200).json('Listening to bot events...');
  }
  debug(`starting webhook on port: ${PORT}`);
};
export { production };
