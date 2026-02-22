import { getToken } from "./submissions";
const API_URL = 'http://localhost:8080/user';

export default async function fetchProblems() {
  const token = await getToken();
  if (!token) throw new Error("Not logged in");

  const response = await fetch(`${API_URL}/all_problems`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error(`Failed: ${response.status}`);

  return await response.json();
}