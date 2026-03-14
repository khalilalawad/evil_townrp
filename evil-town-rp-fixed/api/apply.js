import { sanitize, sendJson } from './_utils.js';

const labels = {
  police: 'Police Department',
  ems: 'EMS Department',
  gang: 'Gang Application',
  justice: 'Justice Department',
};

const colors = {
  police: 3447003,
  ems: 15158332,
  gang: 10181046,
  justice: 15844367,
};

const webhookEnv = {
  police: 'POLICE_WEBHOOK_URL',
  ems: 'EMS_WEBHOOK_URL',
  gang: 'GANG_WEBHOOK_URL',
  justice: 'JUSTICE_WEBHOOK_URL',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  try {
    const department = req.body?.department;
    const envName = webhookEnv[department];
    const webhook = envName ? process.env[envName] : undefined;

    if (!webhook || !labels[department]) {
      return sendJson(res, 400, {
        error: 'Invalid department or missing webhook configuration',
      });
    }

    const payload = {
      embeds: [
        {
          title: `New ${labels[department]}`,
          color: colors[department],
          fields: [
            { name: 'Player Name', value: sanitize(req.body?.name), inline: true },
            { name: 'Age', value: sanitize(req.body?.age), inline: true },
            { name: 'Discord', value: sanitize(req.body?.discordId), inline: false },
            { name: 'Department', value: labels[department], inline: false },
            { name: 'RP Experience', value: sanitize(req.body?.experience), inline: false },
            { name: 'Why Join', value: sanitize(req.body?.reason), inline: false },
            { name: 'Scenario Answer', value: sanitize(req.body?.scenario), inline: false },
            { name: 'Backstory', value: sanitize(req.body?.backstory, 'N/A'), inline: false },
            { name: 'Additional Notes', value: sanitize(req.body?.notes, 'N/A'), inline: false },
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

    return sendJson(res, 200, { success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { error: 'Server error' });
  }
}
