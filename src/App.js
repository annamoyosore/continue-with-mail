import { getAuthUrl } from "./utils/googleAuth";

export default function App() {
  const connectGmail = () => {
    const authUrl = getAuthUrl();
    // Redirect user to OAuth
    window.location.href = authUrl;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335)",
        fontFamily: "'Roboto', sans-serif",
        padding: "2rem",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#202124",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          maxWidth: "400px",
          width: "100%",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Connect Your Gmail</h1>
        <p style={{ marginBottom: "30px", color: "#5f6368" }}>
          Authorize your Gmail account to continue
        </p>

        <button
          onClick={connectGmail}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(45deg, #4285F4, #34A853, #FBBC05, #EA4335)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
          }}
        >
          Connect Gmail
        </button>
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}