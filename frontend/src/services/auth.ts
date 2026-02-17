const API_URL = "http://localhost:8080/user";

export async function handleLogin({ username, password }: { username: string; password: string }) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("invalid credentials");
    const data = await response.json();
    await chrome.storage.local.set({ jwt_token: data.token });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function handleSignup({ username, email, password }: { username: string, email: string; password: string }) {
  try {
    const response = await fetch(`${API_URL}/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error("sign-up failed");
    const data = await response.json();
    await chrome.storage.local.set({ jwt_token: data.token });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function handleLogout() {
  await chrome.storage.local.remove("jwt_token");
  return { success: true };
}