const API = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL_LOCAL;

export async function request(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error("API request Failed!, may be render had powered off his services.");
  }
  return response.json();
}