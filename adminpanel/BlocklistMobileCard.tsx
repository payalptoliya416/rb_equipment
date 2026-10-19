"use client";

import { HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import { BlocklistApiItem } from "@/api/admin/blocklist";
import BlocklistStatusDropdown from "./BlocklistStatusDropdown";

type Props = {
  item: BlocklistApiItem;
  index?: number;
  onEdit: () => void;
  onDelete: () => void;
  onUpdated: () => void;
};

export default function BlocklistMobileCard({
  item,
  index,
  onEdit,
  onDelete,
  onUpdated,
}: Props) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-4">
      {/* HEADER: Type + Status Dropdown */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {index !== undefined ? `${index} • ` : ""}{item.type}
          </span>
          <p className="font-semibold text-gray-900 text-sm break-all mt-0.5">
            {item.value}
          </p>
        </div>

        {/* INLINE STATUS DROPDOWN */}
        <BlocklistStatusDropdown item={item} onUpdated={onUpdated} />
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
