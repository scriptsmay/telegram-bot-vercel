import { Context } from 'telegraf';

const md5 = require('md5');
const VERCEL_URL = process.env.DOMAIN_URL || process.env.VERCEL_URL || '';
const TCKEY = process.env.TCKEY;

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const sendkey = () => (ctx: any) => {
  // console.log('message', ctx.message);

  const messageId = ctx.message.message_id;
  const userName = ctx.from.last_name
    ? `${ctx.from.first_name} ${ctx.from.last_name}`
    : ctx.from.first_name;
  const sendkey = ctx.from.id + 'T' + md5(TCKEY + ctx.from.id);
  const site_url = VERCEL_URL;

  replyToMessage(
    ctx,
    messageId,
    `${userName} , Your sendkey is 🔑 ${sendkey} \n 
  🚀 Use follow url to send message : \n ${site_url}/api/send?sendkey=<sendkey>&text=<text>`,
  );
};

export { sendkey };
