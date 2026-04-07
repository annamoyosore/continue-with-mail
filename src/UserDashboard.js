import { useEffect, useState } from "react";

export default function UserDashboard({ userEmail, tokens }) {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  // Base64 decode helper
  const decodeBase64 = (str) => {
    return decodeURIComponent(atob(str.replace(/-/g, "+").replace(/_/g, "/")).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  };

  // Fetch emails from Gmail API using fetch + token
  const fetchEmails = async () => {
    if (!tokens?.access_token) return;

    try {
      const listRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`
          }
        }
      );
      const listData = await listRes.json();
      const results = [];

      for (const msg of listData.messages || []) {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
          }
        );
        const msgData = await msgRes.json();
        const headers = msgData.payload.headers;
        const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
        const from = headers.find(h => h.name === "From")?.value || "(Unknown)";

        const getBody = (parts) => {
          for (const part of parts || []) {
            if (part.mimeType === "text/html" && part.body.data) {
              return decodeBase64(part.body.data);
            } else if (part.parts) {
              const inner = getBody(part.parts);
              if (inner) return inner;
            }
          }
          return "<p>No content</p>";
        };

        const body = msgData.payload.parts ? getBody(msgData.payload.parts) : "<p>No content</p>";

        results.push({ subject, from, body });
      }

      setEmails(results);
      if (!selectedEmail && results.length > 0) setSelectedEmail(results[0]);
    } catch (err) {
      console.error("Error fetching emails:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "220px", background: "#fff", borderRight: "1px solid #ddd", padding: "10px" }}>
        <h3>📧 Gmail Clone</h3>
        <div style={{ padding: "8px", cursor: "pointer" }}>Inbox</div>
        <div style={{ padding: "8px", cursor: "pointer" }}>Sent</div>
        <div style={{ padding: "8px", cursor: "pointer" }}>Drafts</div>
      </div>

      {/* Email List */}
      <div style={{ width: "300px", borderRight: "1px solid #ddd", overflowY: "auto", background: "#f9f9f9" }}>
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
            <div style={{ fontSize: "14px", color: "#555" }}>{e.subject}</div>
          </div>
        ))}
      </div>

      {/* Email View */}
      <div style={{ flex: 1, padding: "20px", background: "#fff" }}>
        {selectedEmail ? (
          <>
            <h2>{selectedEmail.subject}</h2>
            <p><b>From:</b> {selectedEmail.from}</p>
            <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
          </>
        ) : (
          <p>Select an email</p>
        )}
      </div>
    </div>
  );
}