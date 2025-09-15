import { apiRequest, createApiUrl } from "./api";

function getToken(): string | null {
  try {
    return localStorage.getItem("token") || (window as any).__JWT__ || null;
  } catch {
    return (window as any).__JWT__ || null;
  }
}

function headers() {
  const t = getToken();
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (t) h.Authorization = `Bearer ${t}`;
  return h;
}

export async function fetchApprovedReviews({
  targetId,
  targetType = "property",
  limit = 20,
  signal,
}: {
  targetId: string;
  targetType?: string;
  limit?: number;
  signal?: AbortSignal;
}): Promise<any[]> {
  try {
    const url = `reviews?targetId=${encodeURIComponent(targetId)}&targetType=${encodeURIComponent(
      targetType,
    )}&status=approved&limit=${limit}`;
    const res = await apiRequest(url, { method: "GET", signal });
    if (!res.ok) return [];
    const data = Array.isArray(res.data) ? res.data : res.data?.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function submitReview(
  payload: {
    targetId: string;
    targetType: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  },
  { signal }: { signal?: AbortSignal } = {},
): Promise<{ ok: boolean; status: string }> {
  try {
    const res = await apiRequest("reviews", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(payload),
      signal,
    });
    if (!res.ok) return { ok: false, status: String(res.status) };
    const status = res.data?.data?.status || res.data?.status || "pending";
    return { ok: true, status };
  } catch {
    return { ok: false, status: "error" };
  }
}

export async function adminListPending({
  limit = 50,
  signal,
}: {
  limit?: number;
  signal?: AbortSignal;
}): Promise<any[]> {
  try {
    const res = await apiRequest(`admin/reviews?status=pending&limit=${limit}`, {
      method: "GET",
      headers: headers(),
      signal,
    });
    if (!res.ok) return [];
    const data = Array.isArray(res.data) ? res.data : res.data?.data;
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function adminModerate(
  id: string,
  status: "approved" | "rejected",
  adminNote?: string,
): Promise<boolean> {
  try {
    const res = await apiRequest(`admin/reviews/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ status, adminNote }),
    });
    return !!res.ok;
  } catch {
    return false;
  }
}

export { getToken, headers };
