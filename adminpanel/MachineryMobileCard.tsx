"use client";

import Image from "next/image";
import { HiOutlineEye, HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";

type Props = {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
};

export default function MachineryMobileCard({
  item,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white border border-[#E9E9E9] rounded-xl p-4 space-y-3">
      {/* HEADER */}
      <div className="flex gap-3">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
          <Image
            src={item.image_urls}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-sm">{item.title}</p>
          <p className="font-medium text-sm">{item.auction_id}</p>          
          <p className="text-xs text-gray-500">{item.category}</p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-md h-fit ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : item.status === "Sold"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status}
        </span>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="Year" value={item.year} />
        <Info label="Hours" value={item.workingHours} />
        <Info label="Buy Now" value={item.buyNowPrice} />
        <Info label="Bid Start" value={item.bidStartPrice} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-4 pt-2 border-t border-[#E9E9E9] ">
        {/* <HiOutlineEye className="text-blue-500" size={18} /> */}
        <BiEdit className="text-yellow-500" size={18} onClick={onEdit} />
        <HiOutlineTrash
          className="text-red-500"
          size={18}
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
