export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { email, name, apps } = body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const appList = Array.isArray(apps) && apps.length ? apps.join(', ') : 'unspecified';
  const displayName = name ? name : email;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'kerry.ink <hello@kerry.ink>',
      to: 'kerryourself@gmail.com',
      subject: `Beta signup: ${displayName} → ${appList}`,
      text: `New TestFlight beta request\n\nName: ${name || '—'}\nApple ID: ${email}\nApps: ${appList}\n`,
    }),
  });

  res.status(200).json({ ok: true });
}
