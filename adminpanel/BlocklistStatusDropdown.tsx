"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";
import { adminBlocklistService, BlocklistApiItem } from "@/api/admin/blocklist";
import { HiArrowPath } from "react-icons/hi2";

type StatusType = 0 | 1;

type Props = {
  item: BlocklistApiItem;
  onUpdated: () => void;
};

export default function BlocklistStatusDropdown({ item, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<StatusType | null>(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const value = (item.status === 1 || item.status_text?.toLowerCase() === "active") ? 1 : 0;

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
  const statusConfig: Record<StatusType, { label: string; btnClass: string }> = {
    1: {
      label: "Active",
      btnClass: "bg-[#34C759] text-white",
    },
    0: {
      label: "Inactive",
      btnClass: "bg-[#EF4444] text-white",
    },
  };

  const statusOptions: StatusType[] = [1, 0];
  const current = statusConfig[value as StatusType] || statusConfig[0];

  /* ================= API CALL ================= */
  const handleChange = async (newStatus: StatusType) => {
    if (newStatus === value) {
      setOpen(false);
      return;
    }
    if (loading !== null) return;

    try {
      setLoading(newStatus);

      const res = await adminBlocklistService.update({
        id: item.id,
        type: item.type,
        value: item.value,
        status: newStatus,
      });

      if (res?.status === false) {
        throw new Error(res?.message || "Failed to update status");
      }

      toast.success(res?.message || "Status updated successfully");
      onUpdated();
      setOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setLoading(null);
    }
  };

  /* ================= POSITION ================= */
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
        disabled={loading !== null}
        onClick={(e) => {
          e.stopPropagation();
          handleToggle();
        }}
        className={`flex items-center justify-between gap-2 px-3 py-1.5 w-[110px] rounded-md text-xs font-semibold cursor-pointer shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 ${current.btnClass}`}
      >
        <span>
          {loading !== null ? (
            <span className="flex items-center gap-1">
              <HiArrowPath className="animate-spin" size={14} />
              <span>Saving...</span>
            </span>
          ) : (
            current.label
          )}
        </span>
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
            style={{
              position: "absolute",
              top: position.top + 4,
              left: position.left,
              width: position.width,
              zIndex: 9999,
            }}
            className="bg-white border border-border rounded-lg shadow-xl overflow-hidden py-1 animate-fadeIn"
          >
            {statusOptions.map((st) => {
              const cfg = statusConfig[st];
              const isSelected = st === value;
              return (
                <button
                  key={st}
                  type="button"
                  disabled={loading !== null}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChange(st);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        st === 1 ? "bg-[#34C759]" : "bg-[#EF4444]"
                      }`}
                    />
                    {cfg.label}
                  </span>
                  {isSelected && <span className="text-[10px] text-gray-400">✓</span>}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
