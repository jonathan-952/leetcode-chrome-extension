import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Login from "./popup/Login";
import Signup from "./popup/Signup";
import Dashboard from "./popup/Dashboard";
import "./index.css";
import { handleLogout } from "./services/auth";

type Page = "login" | "signup" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  // Check chrome storage for JWT and listen for changes
  useEffect(() => {
    const checkToken = () => {
      chrome.storage.local.get("jwt_token", (result) => {
        setPage(result.jwt_token ? "dashboard" : "login");
        setLoading(false);
      });
    };

    checkToken();

 const listener = (
  changes: Record<string, chrome.storage.StorageChange>,
  area: string
) => {
  if (area === "local" && "jwt_token" in changes) {  // only react if jwt_token actually changed
    const tokenChange = changes["jwt_token"];
    if (tokenChange?.newValue) {
      setPage("dashboard");
    } else {
      setPage("login");  // covers undefined and null/empty
    }
  }
};

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  if (loading || page === null) return <div className="text-white p-4">Loading...</div>;

  if (page === "dashboard") {
    return (
      <Dashboard
        onLogout={async () => {
          await handleLogout();
          setPage("login");
        }}
      />
    );
  }

  if (page === "signup") {
    return <Signup onSignup={() => setPage("dashboard")} onBack={() => setPage("login")} />;
  }

  return <Login onLogin={() => setPage("dashboard")} onSignup={() => setPage("signup")} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);