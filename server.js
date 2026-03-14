import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const webhooks = {
  police: "https://discord.com/api/webhooks/1482078190917783695/nsqR6Cj30t3UMnsZknOePIUA636TPZC7i2hWD80bZ2YyVeVfOPIB0aqJzJ-M6kGAcRzr",
  ems: "https://discord.com/api/webhooks/1482078290213601512/K-m19EBfzO6pNzSCGJTbJjLXLYKTz-cyVFQ4sDwJlrKYW3l28IJd9R_PQfPwUHxlhvoE",
  gang: "https://discord.com/api/webhooks/1482079018013687849/EcGyKKXrwlz8u_3WaZRfiEy4_Yt1lF7P-t1x9iCls2YIUxqdNacPbhg0zhSui5yZQ0rW",
  justice: "https://discord.com/api/webhooks/1482089354225516686/-XncLMZUcRMQOuy_oKYonMOWxNldmFzAmGY2q9-daLH4en0BS30Si_k7xOv4zPL_DAaU",
};

const labels = {
  police: "Police Department",
  ems: "EMS Department",
  gang: "Gang Application",
  justice: "Justice Department",
};

const colors = {
  police: 3447003,
  ems: 15158332,
  gang: 10181046,
  justice: 15844367,
};

const sanitize = (value, fallback = "Not provided") => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.length > 1000 ? `${trimmed.slice(0, 997)}...` : trimmed;
};

app.post("/api/apply", async (req, res) => {
  try {
    const department = req.body?.department;
    const webhook = webhooks[department];

    if (!webhook) {
      return res.status(400).json({ error: "Invalid department" });
    }

    const payload = {
      embeds: [
        {
          title: `New ${labels[department]}`,
          color: colors[department],
          fields: [
            { name: "Player Name", value: sanitize(req.body?.name), inline: true },
            { name: "Age", value: sanitize(req.body?.age), inline: true },
            { name: "Discord", value: sanitize(req.body?.discordId), inline: false },
            { name: "Department", value: labels[department], inline: false },
            { name: "RP Experience", value: sanitize(req.body?.experience), inline: false },
            { name: "Why Join", value: sanitize(req.body?.reason), inline: false },
            { name: "Scenario Answer", value: sanitize(req.body?.scenario), inline: false },
            { name: "Backstory", value: sanitize(req.body?.backstory, "N/A"), inline: false },
            { name: "Additional Notes", value: sanitize(req.body?.notes, "N/A"), inline: false },
          ],
          footer: { text: "Evil Town RP Website" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to send to Discord" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/character", async (req, res) => {
  try {
    const webhook = process.env.CHARACTER_WEBHOOK_URL;

    if (!webhook) {
      return res.status(500).json({
        error: "Character webhook is not configured",
        message: "Character form is ready, but you still need to add CHARACTER_WEBHOOK_URL.",
      });
    }

    const payload = {
      embeds: [
        {
          title: "New Character Application",
          color: 5793266,
          fields: [
            { name: "Character Name", value: sanitize(req.body?.name), inline: true },
            { name: "Character Age", value: sanitize(req.body?.age), inline: true },
            { name: "Nationality", value: sanitize(req.body?.nationality), inline: false },
            { name: "Occupation", value: sanitize(req.body?.job), inline: false },
            { name: "Backstory", value: sanitize(req.body?.backstory), inline: false },
          ],
          footer: { text: "Evil Town RP Website" },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Failed to send to Discord" });
    }

    return res.json({ success: true, message: "Character application submitted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
