


import { clearToken, getToken } from "./authToken";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Add timeout for file uploads (60 seconds)
  const timeout = isFormData ? 60000 : 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const responseText = await res.text();
    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

if (res.status === 401) {
  if (data?.message) {
    throw new Error(data.message); // ✅ Invalid email or password
  }
  throw new Error("Unauthorized");
}

// ❌ Validation errors (e.g. email already taken)
if (data?.success === false && data?.errors) {
  const err: any = new Error(data.message || "Validation errors");
  err.errors = data.errors;
  throw err;
}

// ❌ API-level error (status:false)
if (data?.status === false) {
  const err: any = new Error(data.message || "Something went wrong");
  if (data?.errors) err.errors = data.errors;
  throw err;
}

// ❌ HTTP error
if (!res.ok) {
  const err: any = new Error(data?.message || "Something went wrong");
  if (data?.errors) err.errors = data.errors;
  throw err;
}

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    // if (err.name === 'AbortError') {
    //   throw new Error('Request timeout. Please try again.');
    // }
    throw err;
  }
}
