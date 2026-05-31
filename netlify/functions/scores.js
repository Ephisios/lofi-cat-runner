// Fonction serveur (Netlify) : relais sécurisé vers Dreamlo.
// Les secrets (codes Dreamlo, mot de passe admin) sont lus depuis les
// variables d'environnement Netlify et ne sont JAMAIS envoyés au navigateur.

const PUBLIC  = process.env.DREAMLO_PUBLIC;
const PRIVATE = process.env.DREAMLO_PRIVATE;
const ADMIN_PASS = process.env.ADMIN_PASS;
const BASE = "http://www.dreamlo.com/lb";   // côté serveur, le HTTP passe sans souci

const json = (code, body) => ({
  statusCode: code,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  try {
    // --- Lecture du classement (GET) ---
    if (event.httpMethod === "GET") {
      const r = await fetch(`${BASE}/${PUBLIC}/json`);
      const data = await r.json();
      let e = data && data.dreamlo && data.dreamlo.leaderboard
        ? data.dreamlo.leaderboard.entry : null;
      if (!e) return json(200, { scores: [] });
      if (!Array.isArray(e)) e = [e];
      const scores = e
        .map(x => ({ name: x.name, score: parseInt(x.score, 10) }))
        .sort((a, b) => b.score - a.score);
      return json(200, { scores });
    }

    // --- Actions (POST) : add / delete ---
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      if (body.action === "add") {
        const name = String(body.name || "").slice(0, 24);
        const score = parseInt(body.score, 10) || 0;
        await fetch(`${BASE}/${PRIVATE}/add/${encodeURIComponent(name)}/${score}`);
        return json(200, { ok: true });
      }

      if (body.action === "delete") {
        // suppression réservée à l'admin : mot de passe revérifié côté serveur
        if (body.password !== ADMIN_PASS) return json(401, { ok: false, error: "unauthorized" });
        const name = String(body.name || "");
        await fetch(`${BASE}/${PRIVATE}/delete/${encodeURIComponent(name)}`);
        return json(200, { ok: true });
      }

      return json(400, { ok: false, error: "bad action" });
    }

    return json(405, { ok: false, error: "method not allowed" });
  } catch (err) {
    return json(500, { ok: false, error: "server error" });
  }
};
