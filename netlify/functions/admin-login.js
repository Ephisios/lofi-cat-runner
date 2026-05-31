// Vérifie le mot de passe admin côté serveur.
// Le mot de passe réel n'est jamais présent dans le code envoyé au navigateur.

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false }) };
  }
  try {
    const { user, password } = JSON.parse(event.body || "{}");
    const ok = user === ADMIN_USER && password === ADMIN_PASS;
    return {
      statusCode: ok ? 200 : 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok })
    };
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }
};
