/*
 * functions for mail verify
 * @flow
 */

/* eslint-disable max-len */

import nodemailer from 'nodemailer';

import logger from './logger';
import { HOUR, MINUTE } from './constants';
import { DailyCron, HourlyCron } from '../utils/cron';
import { getTTag } from './ttag';
import { GMAIL_USER, GMAIL_PW } from './config';

import RegUser from '../data/models/RegUser';


/*
 * define mail transport
 * using unix command sendmail
 */
const transporter = (GMAIL_USER && GMAIL_PW)
  ? nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PW,
    },
  })
  : nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
  });
const from = (GMAIL_USER && GMAIL_PW)
  ? GMAIL_USER
  : 'donotreply@pixelplanet.fun';


// TODO make code expire
class MailProvider {
  verifyCodes: Object;

  constructor() {
    this.clearCodes = this.clearCodes.bind(this);

    this.verifyCodes = {};
    HourlyCron.hook(this.clearCodes);
    DailyCron.hook(MailProvider.cleanUsers);
  }

  sendVerifyMail(to, name, host, lang) {
    const { t } = getTTag(lang);

    const pastMail = this.verifyCodes[to];
    if (pastMail) {
      const minLeft = Math.floor(
        pastMail.timestamp / MINUTE + 2 - Date.now() / MINUTE,
      );
      if (minLeft > 0) {
        logger.info(
          `Verify mail for ${to} - already sent, ${minLeft} minutes left`,
        );
        return t`We already sent you a verification mail, you can request another one in ${minLeft} minutes.`;
      }
    }
    logger.info(`Sending verification mail to ${to} / ${name}`);
    const code = this.setCode(to);
    const verifyUrl = `${host}/api/auth/verify?token=${code}`;
    transporter.sendMail({
      from,
      to,
      replyTo: 'donotreply@pixelplanet.fun',
      subject: t`Welcome ${name} to PixelPlanet, plese verify your mail`,
      // text: `Hello,\nwelcome to our little community of pixelplacers, to use your account, you have to verify your mail. You can do that here:\n ${verifyUrl} \nHave fun and don't hesitate to contact us if you encouter any problems :)\nThanks`,
      html: `<em>${t`Hello ${name}`}</em>,<br />
      ${t`welcome to our little community of pixelplacers, to use your account, you have to verify your mail. You can do that here: `} <a href="${verifyUrl}">${t`Click to Verify`}</a>. ${t`Or by copying following url:`}<br />${verifyUrl}\n<br />
      ${t`Have fun and don't hesitate to contact us if you encouter any problems :)`}<br />
      ${t`Thanks`}<br /><br />
      <img alt="" src="https://assets.pixelplanet.fun/tile.png" style="height:64px; width:64px" />`,
    }, (err) => {
      if (err) {
        logger.error(err);
      }
    });
    return null;
  }

  async sendPasswdResetMail(to, ip, host, lang) {
    const { t } = getTTag(lang);
    const pastMail = this.verifyCodes[to];
    if (pastMail) {
      if (Date.now() < pastMail.timestamp + 15 * MINUTE) {
        logger.info(
          `Password reset mail for ${to} requested by ${ip} - already sent`,
        );
        return t`We already sent you a mail with instructions. Please wait before requesting another mail.`;
      }
    }
    const reguser = await RegUser.findOne({ where: { email: to } });
    if (pastMail || !reguser) {
      logger.info(
        `Password reset mail for ${to} requested by ${ip} - mail not found`,
      );
      return t`Couldn't find this mail in our database`;
    }
    /*
     * not sure if this is needed yet
     * does it matter if spaming password reset mails or verifications mails?
     *
    if(!reguser.verified) {
      logger.info(`Password reset mail for ${to} requested by ${ip} - mail not verified`);
      return "Can't reset password of unverified account.";
    }
    */

    logger.info(`Sending Password reset mail to ${to}`);
    const code = this.setCode(to);
    const restoreUrl = `${host}/reset_password?token=${code}`;
    transporter.sendMail({
      from,
      to,
      replyTo: 'donotreply@pixelplanet.fun',
      subject: t`You forgot your password for PixelPlanet? Get a new one here`,
      // text: `Hello,\nYou requested to get a new password. You can change your password within the next 30min here:\n ${restoreUrl} \nHave fun and don't hesitate to contact us if you encouter any problems :)\nIf you did not request this mail, please just ignore it (the ip that requested this mail was ${ip}).\nThanks`,
      html: `<em>${t`Hello`}</em>,<br />
      ${t`You requested to get a new password. You can change your password within the next 30min here: `} <a href="${restoreUrl}">${t`Reset Password`}</a>. ${t`Or by copying following url:`}<br />${restoreUrl}\n<br />
      ${t`If you did not request this mail, please just ignore it (the ip that requested this mail was ${ip}).`}<br />
      ${t`Thanks`}<br /><br />\n<img alt="" src="https://assets.pixelplanet.fun/tile.png" style="height:64px; width:64px" />`,
    }, (err) => {
      if (err) {
        logger.error(err & err.stack);
      }
    });
    return null;
  }

  setCode(email) {
    const code = MailProvider.createCode();
    this.verifyCodes[email] = {
      code,
      timestamp: Date.now(),
    };
    return code;
  }

  async clearCodes() {
    const curTime = Date.now();
    const toDelete = [];

    const mails = Object.keys(this.verifyCodes);
    for (let i = 0; i < mails.length; i += 1) {
      const iteremail = mails[i];
      if (curTime > this.verifyCodes[iteremail].timestamp + HOUR) {
        toDelete.push(iteremail);
      }
    }
    toDelete.forEach((email) => {
      logger.info(`Mail Code for ${email} expired`);
      delete this.verifyCodes[email];
    });
  }

  // Note: code gets deleted on check
  checkCode(code) {
    let email = null;
    const mails = Object.keys(this.verifyCodes);
    for (let i = 0; i < mails.length; i += 1) {
      const iteremail = mails[i];
      if (this.verifyCodes[iteremail].code === code) {
        email = iteremail;
        break;
      }
    }
    if (!email) {
      logger.info(`Mail Code ${code} not found.`);
      return false;
    }
    logger.info(`Got Mail Code from ${email}.`);
    delete this.verifyCodes[email];
    return email;
  }

  async verify(code) {
    const email = this.checkCode(code);
    if (!email) return false;

    const reguser = await RegUser.findOne({ where: { email } });
    if (!reguser) {
      logger.error(`${email} does not exist in database`);
      return false;
    }
    await reguser.update({
      mailVerified: true,
      verificationReqAt: null,
    });
    return reguser.name;
  }

  static createCode() {
    const part1 = Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);
    const part2 = Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15);
    return `${part1}-${part2}`;
  }

  static cleanUsers() {
    // delete users that requier verification for more than 4 days
    /*
    RegUser.destroy({
      where: {
        verificationReqAt: {
          [Sequelize.Op.lt]:
            Sequelize.literal('CURRENT_TIMESTAMP - INTERVAL 4 DAY'),
        },
        // NOTE: this means that minecraft verified accounts do not get deleted
        verified: 0,
      },
    });
    */
  }
}

const mailProvider = new MailProvider();

export default mailProvider;
