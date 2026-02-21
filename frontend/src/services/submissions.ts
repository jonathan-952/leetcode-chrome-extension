const API_URL = "http://localhost:8080/user";

export async function handleAccepted(payload: object) {
  try {
    console.log(payload);
    const token = await getToken();
    if (!token) { console.error("Not logged in"); return; }

    const response = await fetch(`${API_URL}/submission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`failed: ${response.status}`);
    console.log("Submission tracked");
  } catch (err) {
    console.error(err);
  }
}

export async function getToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get("jwt_token", (result) => {
      resolve((result.jwt_token as string) ?? null);
    });
  });
}