import { Client, Databases } from "node-appwrite";
import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const { code } = req.query; // OAuth code from Google redirect
    if (!code) return res.status(400).json({ error: "Missing code" });

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT);

    const db = new Databases(client);

    // Exchange code for tokens
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get Gmail profile
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: "me" });
    const email = profile.data.emailAddress;

    // Save user in Appwrite
    await db.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      "unique()",
      { email, tokens }
    );

    res.status(200).json({ success: true, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}