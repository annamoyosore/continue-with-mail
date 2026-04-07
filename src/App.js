import { getAuthUrl } from "./utils/googleAuth";

export default function App() {

  const connectGmail = () => {
    const authUrl = getAuthUrl();

    // Redirect (NOT popup)
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Connect Your Gmail</h1>
      <p>Authorize your Gmail to continue</p>

      <button
        onClick={connectGmail}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Connect Gmail
      </button>
    </div>
  );
}