"use client";

import { HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import { BlocklistApiItem } from "@/api/admin/blocklist";
import { FiMail, FiPhone } from "react-icons/fi";
import BlocklistStatusDropdown from "./BlocklistStatusDropdown";

type Props = {
  item: BlocklistApiItem;
  onEdit: () => void;
  onDelete: () => void;
  onUpdated: () => void;
};

export default function BlocklistMobileCard({
  item,
  onEdit,
  onDelete,
  onUpdated,
}: Props) {
  const isEmail = item.type?.toLowerCase() === "email";

  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
      {/* HEADER: Type + Status Dropdown */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isEmail
                ? "bg-blue-50 text-blue-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {isEmail ? <FiMail size={16} /> : <FiPhone size={16} />}
          </span>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              #{item.id} • {item.type}
            </span>
            <p className="font-semibold text-gray-900 text-sm break-all">
              {item.value}
            </p>
          </div>
        </div>

        {/* INLINE STATUS DROPDOWN */}
        <BlocklistStatusDropdown item={item} onUpdated={onUpdated} />
      </div>

      {/* DATES */}
      <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-border">
        <Info
          label="Created Date"
          value={
            item.formatted_created_at ||
            (item.created_at
              ? new Date(item.created_at).toLocaleDateString()
              : "-")
          }
        />
        <Info
          label="Last Updated"
          value={
            item.formatted_updated_at ||
            (item.updated_at
              ? new Date(item.updated_at).toLocaleDateString()
              : "-")
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end items-center gap-3 pt-3 border-t border-border">
        <button
          onClick={onEdit}
          className="text-[#EDB423] hover:text-[#d49f1b] p-1 flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <BiEdit size={16} />
          <span>Edit</span>
        </button>

        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <HiOutlineTrash size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-xs sm:text-sm text-gray-800">{value}</p>
    </div>
  );
}
