const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");

async function scheduledFunctionCrontab() {
  const res = await fetch("https://notices.bulles.fr/api/v3/matching-contexts");
  const resJSON = await res.json();

  if (admin.apps.length === 0) {
    admin.initializeApp(functions.config().firebase);
  }

  const db = admin.firestore();

  const docRef = db.collection("matchingContexts");

  for (const matchingContext of resJSON) {
    docRef.doc().set(matchingContext);
  }
}

exports.scheduledFunctionCrontab = functions
    .pubsub // .schedule("5 11 * * *")
    .schedule("every 30 minutes")
    .onRun(scheduledFunctionCrontab);
