import { supabaseAdmin } from '../config/supabase.js';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        confirmation_token: confirmationToken,
      })
      .select()
      .single();

    if (error) {
      // If email already exists but not confirmed, resend confirmation
      if (error.code === '23505') {
        const { data: existing } = await supabaseAdmin
          .from('newsletter_subscribers')
          .select('confirmation_token, confirmed_at')
          .eq('email', email.toLowerCase().trim())
          .single();

        if (existing && !existing.confirmed_at) {
          // Resend confirmation email
          await sendConfirmationEmail(email, existing.confirmation_token);
          return res.json({ message: 'Confirmation email resent. Please check your inbox.' });
        }
        return res.status(400).json({ error: 'Email already subscribed.' });
      }
      throw error;
    }

    // Send confirmation email
    await sendConfirmationEmail(email, confirmationToken);

    res.json({ message: 'Please check your email to confirm your subscription.' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Subscription failed. Please try again.' });
  }
};

export const confirm = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('Invalid confirmation link.');
    }

    // Find subscriber by token
    const { data: subscriber, error } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, confirmed_at')
      .eq('confirmation_token', token)
      .single();

    if (error || !subscriber) {
      return res.status(400).send('Invalid or expired confirmation link.');
    }

    if (subscriber.confirmed_at) {
      return res.send('Email already confirmed. Thank you!');
    }

    // Mark as confirmed
    await supabaseAdmin
      .from('newsletter_subscribers')
      .update({
        confirmed_at: new Date().toISOString(),
        confirmation_token: null, // clear token after confirmation
      })
      .eq('id', subscriber.id);

    // Redirect to a thank you page on frontend
    res.redirect(`${BASE_URL}/thank-you?subscribed=true`);
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).send('Confirmation failed. Please try again.');
  }
};

async function sendConfirmationEmail(email, token) {
  const confirmUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/newsletter/confirm?token=${token}`;

  await resend.emails.send({
    from: 'VersElite <newsletter@verselite.com>',
    to: email,
    subject: 'Confirm your VersElite newsletter subscription',
    html: `
      <div style="font-family: serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #D4AF37;">VersElite</h1>
        <p>Thank you for subscribing to our newsletter!</p>
        <p>Please confirm your email address by clicking the button below:</p>
        <a href="${confirmUrl}" style="display: inline-block; background: #D4AF37; color: black; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Confirm Subscription</a>
        <p style="margin-top: 24px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
