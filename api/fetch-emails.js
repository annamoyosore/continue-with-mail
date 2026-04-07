import { Client, Databases } from "node-appwrite";
import { google } from "googleapis";

export default async function handler(req, res) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT);

  const db = new Databases(client);

  const users = await db.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_COLLECTION_ID
  );

  const output = [];

  for (const user of users.documents) {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials(user.tokens);

    const gmail = google.gmail({ version: "v1", auth });

    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 5
    });

    const emails = [];

    for (const msg of list.data.messages || []) {
      const m = await gmail.users.messages.get({
        userId: "me",
        id: msg.id
      });

      const headers = m.data.payload.headers;
      const subject = headers.find(h => h.name === "Subject")?.value;
      const from = headers.find(h => h.name === "From")?.value;

      emails.push({ subject, from });
    }

    output.push({ email: user.email, emails });
  }

  res.status(200).json(output);
}