const BASE = import.meta.env.VITE_API_BASE_URL || "https://localhost:7185";

async function request(method, path, body) {
  const url = `${BASE}${path}`;
  const resp = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!resp.ok) {
    let message = `Erro ${resp.status}`;
    let data = null;
    try {
      data = await resp.json();
    } catch (_err) {
      console.warn("Falha ao ler corpo de erro", _err);
    }
    if (data && data.message) message = data.message;
    throw new Error(message);
  }
  if (resp.status === 204) return null;
  const contentType = resp.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;
  const text = await resp.text();
  if (!text) return null;
  return JSON.parse(text);
}

export default {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};