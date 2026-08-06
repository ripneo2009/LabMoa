"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

import { publicEnv } from "@/lib/config/public-env";

function getFirebaseClientApp() {
  const config = publicEnv.firebase;
  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    throw new Error("Firebase Web 설정이 완료되지 않았습니다.");
  }
  return getApps().length ? getApp() : initializeApp(config);
}

export function getGoogleAuthClient() {
  const auth = getAuth(getFirebaseClientApp());
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return { auth, provider };
}

