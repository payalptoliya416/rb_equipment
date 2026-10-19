"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { adminBlocklistService, BlocklistApiItem } from "@/api/admin/blocklist";

type StatusType = "Active" | "Inactive";

type Props = {
  item: BlocklistApiItem;
  onUpdated: () => void;
};

export default function BlocklistStatusDropdown({ item, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !ref.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= STATUS CONFIG ================= */
  const statusConfig: Record<
    StatusType,
    { label: string; btnClass: string; apiValue: 1 | 0 }
  > = {
    Active: {
      label: "Active",
      btnClass: "bg-green-500 text-white",
      apiValue: 1,
    },
    Inactive: {
      label: "Inactive",
      btnClass: "bg-red-500 text-white",
      apiValue: 0,
    },
  };

  const currentStatus: StatusType =
    item.status === 1 || item.status_text?.toLowerCase() === "active"
      ? "Active"
      : "Inactive";

  const current = statusConfig[currentStatus];

  /* ================= CHANGE HANDLER ================= */
  const handleChange = async (newStatus: StatusType) => {
    if (newStatus === currentStatus || loading) return;

    try {
      setLoading(true);

      const res = await adminBlocklistService.update({
        id: item.id,
        type: item.type,
        value: item.value,
        status: statusConfig[newStatus].apiValue,
      });

      if (res?.status === false) {
        throw new Error(res?.message || "Failed to update status");
      }

      toast.success(res?.message || "Status updated successfully");
      setOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TOGGLE / POSITION ================= */
  const handleToggle = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpen((prev) => !prev);
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* BUTTON */}
      <button
        type="button"
        disabled={loading}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={`flex items-center justify-between gap-2 px-2 py-1.5 w-[90px] sm:w-[100px] rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ${
          current.btnClass
        } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span>{loading ? "Updating..." : current.label}</span>
        <FiChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN PORTAL */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 9999,
            }}
            className="rounded-lg bg-white border border-light-gray shadow-lg mt-1"
          >
            {(Object.keys(statusConfig) as StatusType[]).map((status) => {
              const isCurrent = status === currentStatus;

              return (
                <button
                  key={status}
                  type="button"
                  disabled={isCurrent || loading}
                  onClick={() => !isCurrent && handleChange(status)}
                  className={`w-full px-4 py-[10px] text-left text-sm transition-all duration-150 border-b border-light-gray last:border-b-0 rounded-t-lg last:rounded-t-0 last:rounded-b-lg ${
                    isCurrent
                      ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "hover:bg-gray-50 cursor-pointer text-gray-700"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
