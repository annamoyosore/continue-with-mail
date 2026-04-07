import { useEffect, useState } from "react";
import { google } from "googleapis";

export default function UserDashboard({ user }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const fetchEmails = async () => {
    const auth = new google.auth.OAuth2(
      process.env.REACT_APP_GOOGLE_CLIENT_ID,
      process.env.REACT_APP_GOOGLE_CLIENT_SECRET
    );

    auth.setCredentials(user.tokens);

    const gmail = google.gmail({ version: "v1", auth });

    const list = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10
    });

    const results = [];

    for (const msg of list.data.messages || []) {
      const m = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full"
      });

      const headers = m.data.payload.headers;
      const subject = headers.find(h => h.name === "Subject")?.value;
      const from = headers.find(h => h.name === "From")?.value;

      // Extract HTML body
      const getBody = (parts) => {
        for (const part of parts || []) {
          if (part.mimeType === "text/html" && part.body.data) {
            return atob(part.body.data.replace(/-/g, "+").replace(/_/g, "/"));
          } else if (part.parts) {
            const inner = getBody(part.parts);
            if (inner) return inner;
          }
        }
        return "No content";
      };

      const body = getBody(m.data.payload.parts);

      results.push({ subject, from, body });
    }

    setEmails(results);
    if (!selectedEmail && results.length > 0) {
      setSelectedEmail(results[0]);
    }
  };

  useEffect(() => {
    fetchEmails();
    const i = setInterval(fetchEmails, 10000);
    return () => clearInterval(i);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>

      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#fff",
        borderRight: "1px solid #ddd",
        padding: "10px"
      }}>
        <h3>📧 Gmail Clone</h3>
        <div style={{ padding: "8px", cursor: "pointer" }}>Inbox</div>
        <div style={{ padding: "8px", cursor: "pointer" }}>Sent</div>
        <div style={{ padding: "8px", cursor: "pointer" }}>Drafts</div>
      </div>

      {/* Email List */}
      <div style={{
        width: "300px",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
        background: "#f9f9f9"
      }}>
        {emails.map((e, i) => (
          <div
            key={i}
            onClick={() => setSelectedEmail(e)}
            style={{
              padding: "10px",
              borderBottom: "1px solid #eee",
              cursor: "pointer",
              background: selectedEmail === e ? "#e8f0fe" : "#fff"
            }}
          >
            <b>{e.from}</b>
            <div style={{ fontSize: "14px", color: "#555" }}>
              {e.subject}
            </div>
          </div>
        ))}
      </div>

      {/* Email View */}
      <div style={{ flex: 1, padding: "20px", background: "#fff" }}>
        {selectedEmail ? (
          <>
            <h2>{selectedEmail.subject}</h2>
            <p><b>From:</b> {selectedEmail.from}</p>
            <div
              style={{ marginTop: "20px" }}
              dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
            />
          </>
        ) : (
          <p>Select an email</p>
        )}
      </div>

    </div>
  );
}