// /api/auth/google.js
import { google } from "googleapis";
import { Client, Databases, ID } from "node-appwrite";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "No code provided" });

    // Initialize Google OAuth
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

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT)
      .setKey(process.env.APPWRITE_API_KEY);

    const db = new Databases(client);

    // Save user to Appwrite
    await db.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      ID.unique(),
      { email, tokens }
    );

    // Return success JSON
    return res.status(200).json({ success: true, email });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
}