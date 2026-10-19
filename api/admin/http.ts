import { getAdminToken } from "./adminAuth";


export const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_BASE_URL;


export async function adminApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const isFormData = options.body instanceof FormData;

  const cleanEndpoint = endpoint.startsWith("/admin/")
    ? endpoint.replace(/^\/admin/, "")
    : endpoint === "/admin"
    ? ""
    : endpoint;

  const res = await fetch(`${ADMIN_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let data: any = null;

  try {
    data = await res.json(); // try JSON first
  } catch {
    data = null; // backend sent empty or non-JSON
  }

  if (!res.ok) {
    let message = "Something went wrong";

    // 1. Check for detailed validation errors: { errors: { field: ["error message"] } }
    if (data?.errors && typeof data.errors === "object") {
      const keys = Object.keys(data.errors);
      if (keys.length > 0) {
        const firstErr = data.errors[keys[0]];
        if (Array.isArray(firstErr) && firstErr.length > 0) {
          message = firstErr[0];
        } else if (typeof firstErr === "string") {
          message = firstErr;
        }
      }
    } else if (data?.message) {
      if (typeof data.message === "string") {
        message = data.message;
      } else if (typeof data.message === "object") {
        const key = Object.keys(data.message)[0];
        if (Array.isArray(data.message[key])) {
          message = data.message[key][0];
        }
      }
    }

    const err: any = new Error(message);
    err.errors = data?.errors;
    err.data = data;
    err.status = res.status;
    throw err;
  }

  return data as T;
}
