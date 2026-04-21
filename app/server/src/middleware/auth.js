import { supabaseAdmin } from '../config/supabase.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.error('Supabase auth error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error('Middleware network error:', err);
    return res.status(503).json({ error: 'Authentication service unavailable' });
  }
};
