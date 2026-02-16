"use client";

import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import UserStatusDropdown from "@/adminpanel/UserStatusDropdown";
import { BiEdit } from "react-icons/bi";

type Props = {
  user: any;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  onUpdated: () => void;
};

export default function UserMobileCard({
  user,
  onEdit,
  onView,
  onDelete,
  onUpdated,
}: Props) {
  return (
    <div className="bg-white border border-[#E9E9E9] rounded-xl p-4 space-y-4">
      {/* Name + Status */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <UserStatusDropdown
          value={user.status_text}
          userId={user.id}
          onUpdated={onUpdated}
        />
      </div>

      <div className="text-sm space-y-1">
        <Row label="Phone" value={user.phone} />
        <Row label="Registered" value={user.date} />
        <Row label="License" value={user.license_status_text ?? "No License"} />
      </div>

      {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#E9E9E9]">
        <button onClick={onView} className="text-blue-500"><HiOutlineEye /></button>
        <button onClick={onEdit} className="text-yellow-500"><BiEdit /></button>
        <button onClick={onDelete} className="text-red-500">
          <HiOutlineTrash />
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded-full
        ${danger ? "text-red-500 hover:bg-red-50" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}
