const API_URL = "https://apiautismoemfoco.onrender.com";

export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err.message || "Erro ao conectar com a API";
  }

  return res.json();
}

export async function apiGet(path, token) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Authorization": token ? `Bearer ${token}` : "",
    },
  });

  if (!res.ok) throw "Erro ao buscar dados";
  return res.json();
}
