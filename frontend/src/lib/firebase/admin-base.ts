import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { getFirebaseServerConfig } from "@/lib/config/env";

function createFirebaseApp() {
  const config = getFirebaseServerConfig();
  const hasServiceAccount = config.projectId && config.clientEmail && config.privateKey;
  return initializeApp({
    credential: hasServiceAccount
      ? cert({ projectId: config.projectId, clientEmail: config.clientEmail, privateKey: config.privateKey })
      : applicationDefault(),
    projectId: config.projectId,
  });
}

const firebaseApp = getApps()[0] ?? createFirebaseApp();
export const firestore = getFirestore(firebaseApp);

