import { google } from "googleapis";

export function getAuthUrl() {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.REACT_APP_GOOGLE_CLIENT_ID,
    process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
    process.env.REACT_APP_GOOGLE_REDIRECT_URI
  );

  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    prompt: "consent"
  });
}