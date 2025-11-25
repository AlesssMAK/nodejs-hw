import { jwt } from 'jsonwebtoken';
import { User } from '../models/user.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendEmail } from '../utils/sendEmail.js';
import createHttpError from 'http-errors';

export const requestResetEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(200).json({ message: 'Password reset email sent successfully' });
    return;
  }

  const resetToken = jwt.sing(
    {
      sub: user._id,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  const templatePath = path.resolve('src/templates/reset-password-email.html');
  const templateSource = await fs.readFile(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.username,
    link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch {
    next(
      createHttpError(500, 'Failed to send the email, please try again later.'),
    );
    return;
  }

  res.status(200).json({ message: 'Password reset email sent successfully' });
};
