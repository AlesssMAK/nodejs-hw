import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    next(createHttpError(400, 'Email in use'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json({ newUser });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    next(createHttpError(401, 'Invalid credentials'));
    return;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    next(createHttpError(401, 'Invalid credentials'));
    return;
  }

  res.status(200).json(user);
};

export const refreshUserSession = async (req, res, next) => {
  const session = await Session.findOne({
    _id: req.cookie.sessionId,
    refreshToken: req.cookie.refreshToken,
  });

  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    return next(createHttpError(401, 'Session token expired'));
  }

  await Session.deleteOne({
    _id: req.cookie.sessionId,
    refreshToken: req.cookie.refreshToken,
  });

  const newSession = createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookie;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
