import { fetchWithAuth } from "../helpers/fetchWithAuth";
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export class BaseService<T> {
  public endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAll(query?: string): Promise<any> {
    let url = `${baseUrl}/${this.endpoint}`;
    if (query && query.trim() !== "") {
      url += `?${query}`;
    }
    const res = await fetchWithAuth(url, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { message: "Erro ao buscar dados", ...errorData };
    }
    return res.json();
  }

  async get(id: string): Promise<T> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { message: "Erro ao buscar item", ...errorData };
    }
    return res.json();
  }

  async create(item: T, endpoint?: string): Promise<T> {
    const url = endpoint
      ? `${baseUrl}/${endpoint}`
      : `${baseUrl}/${this.endpoint}`;
    const res = await fetchWithAuth(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { message: "Erro ao criar item", ...errorData };
    }
    return res.json();
  }

  async update(id: string, item: T): Promise<T> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { message: "Erro ao atualizar item", ...errorData };
    }
    return res.json();
  }

  async delete(id: string): Promise<void> {
    const res = await fetchWithAuth(`${baseUrl}/${this.endpoint}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw { message: "Erro ao deletar item", ...errorData };
    }
  }
}