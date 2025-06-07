import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.get('/auth/patreon', (req, res) => {
  const clientId = process.env.PATREON_CLIENT_ID;
  const redirectUri = process.env.PATREON_REDIRECT_URI;
  if (!clientId || !redirectUri) return res.status(500).send('Missing Patreon config');
  const url =
    `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;
  res.redirect(url);
});

app.get('/api/callback', async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).json({ error: 'Missing code' });
  try {
    const tokenRes = await axios.post(
      'https://www.patreon.com/api/oauth2/token',
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: process.env.PATREON_CLIENT_ID!,
        client_secret: process.env.PATREON_CLIENT_SECRET!,
        redirect_uri: process.env.PATREON_REDIRECT_URI!,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token } = tokenRes.data;
    await prisma.patreonToken.upsert({
      where: { id: 1 },
      create: { id: 1, accessToken: access_token, refreshToken: refresh_token },
      update: { accessToken: access_token, refreshToken: refresh_token },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to exchange code' });
  }
});

app.get('/api/me', async (req, res) => {
  const token = await prisma.patreonToken.findUnique({ where: { id: 1 } });
  if (!token) return res.status(403).json({ isPatron: false });
  try {
    const meRes = await axios.get(
      'https://www.patreon.com/api/oauth2/v2/identity?include=memberships.campaign&fields%5Bmember%5D=currently_entitled_amount_cents',
      { headers: { Authorization: `Bearer ${token.accessToken}` } }
    );

    const memberships = meRes.data.included;
    if (memberships && memberships.length > 0) {
      res.status(200).json({ isPatron: true });
    } else {
      res.status(403).json({ isPatron: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
