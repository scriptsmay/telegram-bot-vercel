import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:greeting_text');
const md5 = require('md5');
const VERCEL_URL = process.env.DOMAIN_URL || process.env.VERCEL_URL || '';
const TCKEY = process.env.TCKEY || '';

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const sendkey = () => async (ctx: Context) => {
  debug('Triggered "sendkey" text command');
  console.log('message', ctx.message);

  const messageId = ctx.message?.message_id || 0;
  const userName = ctx.from?.last_name
    ? `${ctx.from.first_name} ${ctx.from.last_name}`
    : ctx.from?.first_name;
  const sendkey = ctx.from?.id + 'T' + md5(TCKEY + ctx.from?.id);
  const site_url = VERCEL_URL;

  if (messageId) {
    await replyToMessage(
      ctx,
      messageId,
      `${userName} , Your sendkey is 🔑 ${sendkey} \n 
    🚀 Use follow url to send message : \n ${site_url}/api/send?sendkey=<sendkey>&text=<text>`,
    );
  }
};

export { sendkey };
