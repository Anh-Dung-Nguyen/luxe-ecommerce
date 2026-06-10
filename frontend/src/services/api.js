const API_URL = "http://localhost:5000/api";

export async function apiFetch(path, opts = {}) {
    const token = localStorage.getItem("token");
    const headers = { 
        "Content-Type": "application/json", 
        ...(token ? { Authorization: `Bearer ${token}` } : {}), 
        ...opts.headers 
    };
    
    const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    
    if (!res.ok) {
        throw new Error(data.message || "Request failed");
    }

    return data;
}