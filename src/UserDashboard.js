import { useState, useEffect } from "react";
import { google } from "googleapis";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;

export default function UserDashboard({ userEmail, tokens }) {
  const [emails, setEmails] = useState([]);

  const fetchMyEmails = async () => {
    try {
      const oAuthClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
      oAuthClient.setCredentials(tokens);

      const gmail = google.gmail({ version: "v1", auth: oAuthClient });
      const messagesList = await gmail.users.messages.list({ userId: "me", maxResults: 5 });

      const myEmails = [];
      for (const msg of messagesList.data.messages || []) {
        const message = await gmail.users.messages.get({ userId: "me", id: msg.id, format: "full" });

        const headers = message.data.payload.headers;
        const subject = headers.find(h => h.name === "Subject")?.value;
        const from = headers.find(h => h.name === "From")?.value;

        // HTML body
        let body = "";
        const getBodyFromParts = (parts) => {
          for (const part of parts || []) {
            if (part.mimeType === "text/html" && part.body.data) {
              return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
            } else if (part.parts) {
              const inner = getBodyFromParts(part.parts);
              if (inner) return inner;
            }
          }
          return "";
        };
        body = getBodyFromParts(message.data.payload.parts);

        // Attachments
        const attachments = [];
        const getAttachments = (parts) => {
          for (const part of parts || []) {
            if (part.filename && part.body.attachmentId) {
              attachments.push({ filename: part.filename, mimeType: part.mimeType, attachmentId: part.body.attachmentId });
            }
            if (part.parts) getAttachments(part.parts);
          }
        };
        getAttachments(message.data.payload.parts);

        myEmails.push({ subject, from, body, attachments });
      }

      setEmails(myEmails);
    } catch (err) {
      console.error("Error fetching user emails:", err);
    }
  };

  useEffect(() => {
    fetchMyEmails();
    const interval = setInterval(fetchMyEmails, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {userEmail}</h1>
      <h2>Your Gmail Inbox</h2>
      {emails.map((e, idx) => (
        <div key={idx} style={{ marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>
          <b>From:</b> {e.from} <br />
          <b>Subject:</b> {e.subject} <br />
          <div style={{ border: "1px solid #ddd", padding: "0.5rem", background: "#f9f9f9" }} dangerouslySetInnerHTML={{ __html: e.body }} />
          {e.attachments.length > 0 && (
            <div>
              <b>Attachments:</b>
              <ul>
                {e.attachments.map((a, i) => <li key={i}>{a.filename} ({a.mimeType})</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  }
