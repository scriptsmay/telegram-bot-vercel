import { Telegraf } from 'telegraf';

import { about, sendkey } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.command('about', about());
bot.command('sendkey', sendkey());
bot.on('message', greeting());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  if (req.url == '/favicon.ico') {
    res.status(200).end();
    return;
  }
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
