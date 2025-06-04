{
  "type"; "module",
  "main"; "index.js",
  "dependencies"; {
    "agora-access-token"; "^4.1.0"
  }
}

/**
 * Cloud Functions v2 – Agora RTC token generator
 * HTTP GET /generateAgoraToken?channelName=<name>&uid=<number>
 */
const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

// Initialize Firebase Admin SDK
initializeApp({ credential: applicationDefault() });

// Agora credentials (replace with real values)
const AGORA_APP_ID = "5633ebf2d65c415581178e25fb64d859";
const AGORA_CERT   = "c2d44453578948e595a9f17919554bea";
const TOKEN_TTL_SEC = 60 * 60;   // 1 hour

exports.generateAgoraToken = onRequest((req, res) => {
  const { channelName, uid } = req.query;
  if (!channelName || !uid) {
    return res.status(400).json({ error: "channelName and uid required" });
  }
  const numericUid = Number(uid);
  if (Number.isNaN(numericUid)) {
    return res.status(400).json({ error: "uid must be numeric" });
  }
  const expireAt = Math.floor(Date.now() / 1000) + TOKEN_TTL_SEC;
  const token = RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_CERT,
    channelName,
    numericUid,
    RtcRole.PUBLISHER,
    expireAt
  );
  return res.json({ token, expireAt });
});