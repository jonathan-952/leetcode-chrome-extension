// const API_URL = "https://lcrecall.xyz/user";
const API_URL = "http://localhost:8080/user";

export async function handleLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error);
    }
    const token = await response.text();

    // ✅ Wait until token is fully written to storage
    await chrome.storage.local.set({ jwt_token: token });
    return { success: true, token };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, error: message };
  }
}

export async function handleSignup({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const response = await fetch(`${API_URL}/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
   if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return { success: true};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, error: message };
  }
}

export async function handleLogout() {
  await chrome.storage.local.remove("jwt_token");
  return { success: true };
}