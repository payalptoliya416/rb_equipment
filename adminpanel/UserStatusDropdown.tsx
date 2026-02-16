import { adminUserService } from "@/api/admin/usersManagement";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiChevronDown } from "react-icons/fi";

type StatusType = "Active" | "Blocked";

type Props = {
  value?: StatusType | string | null;
  userId: number;
  onUpdated: () => void;
};

export default function UserStatusDropdown({
  value,
  userId,
  onUpdated,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= STATUS CONFIG ================= */
  const statusConfig: Record<
    StatusType,
    { label: string; btnClass: string; apiValue: 1 | 2 }
  > = {
    Active: {
      label: "Active",
      btnClass: "bg-green-500 text-white",
      apiValue: 1,
    },
    Blocked: {
      label: "Blocked",
      btnClass: "bg-red-500 text-white",
      apiValue: 2,
    },
  };

  const currentStatus: StatusType =
    value === "Blocked" ? "Blocked" : "Active";

  const current = statusConfig[currentStatus];

  /* ================= CHANGE HANDLER ================= */
  const handleChange = async (status: StatusType) => {
    try {
      await adminUserService.changeStatus(
        userId,
        statusConfig[status].apiValue
      );

      toast.success("User status updated");
      setOpen(false);
      onUpdated();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div ref={ref} className="relative inline-block">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between gap-2 px-2 py-1.5 w-[100px] rounded-md text-sm font-medium cursor-pointer transition-all duration-150 ${current.btnClass}
        `}
      >
        {current.label}
        <FiChevronDown
          className={`transition-transform duration-200 ${ open ? "rotate-180" : "" }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute left-0 mt-3 w-[120px] rounded-lg bg-white border border-light-gray z-50">
         {(Object.keys(statusConfig) as StatusType[]).map((status) => {
  const isCurrent = status === currentStatus;

  return (
    <button
      key={status}
      disabled={isCurrent}
      onClick={() => !isCurrent && handleChange(status)}
      className={`w-full px-6 py-[10px] text-left text-sm transition-all duration-150 border-b border-light-gray last:border-b-0 rounded-t-lg last:rounded-t-0 last:rounded-b-lg
        ${
          isCurrent
            ? "text-gray-400 cursor-not-allowed bg-gray-50"
            : "cursor-pointer hover:bg-gray-50 active:bg-gray-100 active:scale-[0.97]"
        }
      `}
    >
      {status}
      {isCurrent}
    </button>
  );
})}

        </div>
      )}
    </div>
  );
}
