import "server-only";

import { getAuth } from "firebase-admin/auth";

export interface VerifiedGoogleIdentity {
  uid: string;
  email: string;
  name: string;
}

export async function verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleIdentity> {
  const decoded = await getAuth().verifyIdToken(idToken);
  if (decoded.firebase.sign_in_provider !== "google.com") {
    throw new Error("Google provider token is required.");
  }
  if (!decoded.email || decoded.email_verified !== true) {
    throw new Error("A verified Google email is required.");
  }
  return {
    uid: decoded.uid,
    email: decoded.email,
    name: typeof decoded.name === "string" && decoded.name.trim()
      ? decoded.name.trim()
      : decoded.email.split("@")[0],
  };
}

