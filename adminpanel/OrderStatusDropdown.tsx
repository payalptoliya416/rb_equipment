"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { adminOrdersService } from "@/api/admin/orders";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Process"
  | "Shipped"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

type Props = {
  value: OrderStatus;
  orderId: number;
  onUpdated: () => void;
};

export default function OrderStatusDropdown({
  value,
  orderId,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const [updating, setUpdating] = useState(false); // ✅ effect

  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ================= STATUS CONFIG ================= */
 const statusConfig: Record<
  OrderStatus,
  { label: string; btnClass: string; apiValue: number }
> = {
  Pending: {
    label: "Pending",
    btnClass: "bg-yellow-400 text-black",
    apiValue: 0,
  },
  Confirmed: {
    label: "Confirmed",
    btnClass: "bg-blue-500 text-white",
    apiValue: 1,
  },
  Process: {
    label: "Process",
    btnClass: "bg-purple-500 text-white",
    apiValue: 2,
  },
  Shipped: {
    label: "Shipped",
    btnClass: "bg-blue-500 text-white",
    apiValue: 3,
  },
  "In Transit": {
    label: "In Transit",
    btnClass: "bg-indigo-500 text-white",
    apiValue: 4,
  },
  Delivered: {
    label: "Delivered",
    btnClass: "bg-green-500 text-white",
    apiValue: 5,
  },
  Cancelled: {
    label: "Cancelled",
    btnClass: "bg-red-500 text-white",
    apiValue: 6,
  },
};

  const current = statusConfig[value] ?? statusConfig["Pending"];

  /* ================= MOBILE CHECK ================= */
  const isMobile = typeof window !== "undefined" && window.innerWidth < 992;

  /* ================= OPEN ================= */
const openAccordion = () => {
  if (!btnRef.current) return;

  const rect = btnRef.current.getBoundingClientRect();
  const dropdownHeight = 280; // approx
  const margin = 8;

  let top = rect.top - dropdownHeight - margin;
  let left = rect.left;

  if (top < margin) {
    top = rect.bottom + margin; // niche khule
  }

  if (left + 200 > window.innerWidth) {
    left = window.innerWidth - 210;
  }

  setPos({ top, left });
  setOpen(true);
};


  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* ================= STATUS CHANGE ================= */
  const handleChange = async (status: OrderStatus) => {
    try {
      setUpdating(true); // ✅ start effect

      await adminOrdersService.updateStatus({
        order_id: orderId,
        status: statusConfig[status].apiValue,
      });

      toast.success("Order status updated");

      setOpen(false);
      onUpdated();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update order status");
    } finally {
      setUpdating(false); // ✅ stop effect
    }
  };

  /* ================= STATUS LIST ================= */
  const allStatuses = Object.keys(statusConfig) as OrderStatus[];

  return (
    <>
      {/* BUTTON */}
      <button
        ref={btnRef}
        disabled={updating}
        onClick={() => (open ? setOpen(false) : openAccordion())}
        className={`
          flex items-center justify-between gap-2
          px-3 py-2 w-[140px]
          rounded-lg text-sm font-medium
          shadow-sm border border-[#E9E9E9]
          transition cursor-pointer
          ${current?.btnClass ?? "bg-gray-400 text-white"}
          ${updating ? "opacity-70 cursor-not-allowed" : ""}
        `}
      >
        {updating ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating...
          </span>
        ) : (
          current.label
        )}

        {!updating && (
          <FiChevronDown
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* DROPDOWN */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
            }}
            className="
              w-[200px]
              rounded-xl bg-white
              shadow-xl border border-[#E9E9E9]
              z-[99999999]
              overflow-hidden
            "
          >
                  {allStatuses.map((status) => {
                    const currentValue = statusConfig[value].apiValue;
                    const targetValue = statusConfig[status].apiValue;

                    const isCurrent = status === value;
                    const isBackward = targetValue < currentValue;
                    const isDelivered = value === "Delivered";
                    const isCancelled = status === "Cancelled";

                    const cancelBlocked =  isCancelled && value === "Delivered";

                    const disabled =
                      isCurrent || isBackward || isDelivered || cancelBlocked;

                    return (
                      <button
                        key={status}
                        disabled={disabled || updating}
                        onClick={() => handleChange(status)}
                        className={`
              w-full px-4 py-3
              flex justify-between items-center
              text-sm border-b last:border-b-0 border-light-gray
              transition
              ${
                isCurrent
                  ? "bg-green-50 text-green-700 font-semibold cursor-default"
                  : disabled
                    ? "text-gray-400 cursor-not-allowed bg-gray-50"
                    : "hover:bg-gray-50 cursor-pointer"
              }
            `}
                >
                  <span>{status}</span>
                  {isCurrent && (
                    <span className="text-green-600 font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
