import { adminApi } from "./http";

export interface BlocklistApiItem {
  id: number;
  type: string; // "email" | "phone"
  value: string;
  status: number; // 0 | 1
  status_text: string; // "Inactive" | "Active"
  created_at: string;
  updated_at: string;
  formatted_created_at?: string;
  formatted_updated_at?: string;
}

export interface BlocklistApiResponse {
  status: boolean;
  message: string;
  data: BlocklistApiItem[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface BlocklistSingleResponse {
  status: boolean;
  message: string;
  data: BlocklistApiItem;
  errors?: Record<string, string[]>;
}

export interface BlocklistQueryPayload {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface BlocklistStorePayload {
  type: "email" | "phone" | string;
  value: string;
  status: number; // 0 = Inactive, 1 = Active
}

export interface BlocklistUpdatePayload {
  id: number;
  type: "email" | "phone" | string;
  value: string;
  status: number; // 0 = Inactive, 1 = Active
}

export const adminBlocklistService = {
  /** LIST ALL: POST /admin/blocklists */
  getBlocklists: (payload: BlocklistQueryPayload) =>
    adminApi<BlocklistApiResponse>("/blocklists", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** SHOW SINGLE: POST /admin/blocklists/show */
  show: (id: number) =>
    adminApi<BlocklistSingleResponse>("/blocklists/show", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

  /** STORE / CREATE: POST /admin/blocklists/store */
  create: (payload: BlocklistStorePayload) =>
    adminApi<BlocklistSingleResponse>("/blocklists/store", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** UPDATE: POST /admin/blocklists/update */
  update: (payload: BlocklistUpdatePayload) =>
    adminApi<BlocklistSingleResponse>("/blocklists/update", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /** DELETE: POST /admin/blocklists/delete */
  delete: (id: number) =>
    adminApi<{ status: boolean; message: string }>("/blocklists/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
