const API_BASE = "/api";

async function requestJson(path: string) {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export async function getHealth() {
  return requestJson("/health");
}
