// utils/googleAuth.js
export function getAuthUrl() {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=https://www.googleapis.com/auth/gmail.readonly&access_type=offline&prompt=consent`;
}