import { getAdminToken } from "./adminAuth";

export const ADMIN_BASE_URL =
  "https://stiopa-equipment.com/api/api/admin";

// export async function adminApi<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = getAdminToken();
//   const isFormData = options.body instanceof FormData;

//   try {
//     const res = await fetch(`${ADMIN_BASE_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...options.headers,
//       },
//     });
//     const text = await res.text();
//     const data = text ? JSON.parse(text) : {};

//     // ❌ API responded but error
//     if (!res.ok) {
//       let message = "Something went wrong";

//       if (typeof data?.message === "string") {
//         message = data.message;
//       } else if (typeof data?.message === "object") {
//         const key = Object.keys(data.message)[0];
//         if (Array.isArray(data.message[key])) {
//           message = data.message[key][0];
//         }
//       }

//       // 🔥 ONLY throw (NO toast here)
//       throw new Error(message);
//     }

//     return data as T;
//   } catch (error: any) {
//     // ✅ ONLY network / fetch error
//     if (!error?.message) {
//       throw new Error("Network error");
//     }

//     // 🔁 API error → pass to component
//     throw error;
//   }
// }
export async function adminApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAdminToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${ADMIN_BASE_URL}${endpoint}`, {
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
    let message = "Invalid email or password";

    // If backend sends message → use it
    if (data?.message) {
      if (typeof data.message === "string") {
        message = data.message;
      } else if (typeof data.message === "object") {
        const key = Object.keys(data.message)[0];
        if (Array.isArray(data.message[key])) {
          message = data.message[key][0];
        }
      }
    }

    throw new Error(message);
  }

  return data as T;
}
