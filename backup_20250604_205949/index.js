const admin = require("firebase-admin");
const agora = require("agora-access-token");
const serviceAccount = require("Firebaseの秘密鍵")
const functions = require("firebase-functions");

// Firebase Admin SDKの初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "データベースの名前",
});

// Firebase Cloud Functionのエントリポイント
exports.generateAgoraToken = functions.https.onCall(async (data, context) => {
  // ユーザーの認証
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication is required."
    );
  }

  // パラメータの取得
  const channelName = data.channelName;
  const uid = data.uid;
  
  // Agora App ID
    const agoraAppId = "5633ebf2d65c415581178e25fb64d859";
  
    // Agora App Certificate
    const agoraAppCertificate = "c2d44453578948e595a9f17919554bea";
  
    // トークンの有効期限 (秒単位)
    const expirationTimeInSeconds = 3600;
  
    // Agoraトークンの生成
    const token = agora.RtcTokenBuilder.buildTokenWithUid(
      agoraAppId,
      agoraAppCertificate,
      channelName,
      uid,
      agora.RtcRole.PUBLISHER,
      Math.floor(Date.now() / 1000) + expirationTimeInSeconds
    );

  return {token};
});
