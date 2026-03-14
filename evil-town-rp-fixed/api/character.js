import { sanitize, sendJson } from './_utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const webhook = process.env.CHARACTER_WEBHOOK_URL;

    if (!webhook) {
      return sendJson(res, 500, {
        error: 'Character webhook is not configured',
        message: 'Add CHARACTER_WEBHOOK_URL in Vercel environment variables.',
      });
    }

    const payload = {
      embeds: [
        {
          title: 'New Character Application',
          color: 5793266,
          fields: [
            { name: 'Character Name', value: sanitize(req.body?.name), inline: true },
            { name: 'Character Age', value: sanitize(req.body?.age), inline: true },
            { name: 'Nationality', value: sanitize(req.body?.nationality), inline: false },
            { name: 'Occupation', value: sanitize(req.body?.job), inline: false },
            { name: 'Backstory', value: sanitize(req.body?.backstory), inline: false },
          ],
          footer: { text: 'Evil Town RP Website' },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return sendJson(res, 500, { error: 'Failed to send to Discord' });
    }

    return sendJson(res, 200, { success: true, message: 'Character application submitted successfully.' });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Server error' });
  }
}
