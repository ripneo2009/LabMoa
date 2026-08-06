function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export interface FirebaseServerConfig {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
}

/** Server-only Firebase credentials. Application Default Credentials are used when omitted. */
export function getFirebaseServerConfig(): FirebaseServerConfig {
  return {
    projectId: optional("FIREBASE_PROJECT_ID"),
    clientEmail: optional("FIREBASE_CLIENT_EMAIL"),
    privateKey: optional("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
  };
}
