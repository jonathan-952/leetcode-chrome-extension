import type { Problem } from "../popup/Dashboard";
import { getToken } from "./submissions";
const API_URL = 'http://localhost:8080/user';

export async function handleFetchProblems() {
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

export async function handleDeleteProblem(problem: Problem) {
  const token = await getToken();
  if (!token) throw new Error("Not logged in");

  const response = await fetch(`${API_URL}/complete_problem`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(problem)
  });

  if (!response.ok) throw new Error(`Failed: ${response.status}`);

  return await response.json();

} 