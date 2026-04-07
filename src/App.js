import { useState, useEffect } from "react";
import { Client, Databases } from "node-appwrite";
import { google } from "googleapis";
import UserDashboard from "./UserDashboard";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

const APPWRITE_ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT = process.env.REACT_APP_APPWRITE_PROJECT;
const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const COLLECTION_ID = process.env.REACT_APP_APPWRITE_COLLECTION_ID;

const client = new Client();
client.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT);
const databases = new Databases(client);

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const connectGmail = () => {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const authUrl = oAuth2Client.generateAuthUrl({ access_type: "offline", scope: ["https://www.googleapis.com/auth/gmail.readonly"], prompt: "consent" });
    window.open(authUrl, "_blank", "width=500,height=600");
  };

  const fetchCurrentUser = async () => {
    const userEmail = "user@example.com"; // Replace with actual logged-in email
    const users = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [`email=${userEmail}`]);
    if (users.documents.length > 0) setCurrentUser(users.documents[0]);
  };

  useEffect(() => { fetchCurrentUser(); }, []);

  if (currentUser) return <UserDashboard userEmail={currentUser.email} tokens={currentUser.tokens} />;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome</h1>
      <button onClick={connectGmail}>Connect Gmail</button>
    </div>
  );
}
