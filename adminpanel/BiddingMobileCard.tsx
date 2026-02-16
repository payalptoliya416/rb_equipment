"use client";

import { BiEdit } from "react-icons/bi";

type Props = {
  item: any;
  onEdit: () => void;
};

export default function BiddingMobileCard({ item, onEdit }: Props) {
  const statusMap: Record<string, string> = {
    active: "bg-green-500 text-white",
    pending: "bg-yellow-400 text-black",
    sold: "bg-blue-500 text-white",
  };

  const statusLabel: Record<string, string> = {
    active: "Active",
    pending: "Pending",
    sold: "Sold",
  };

  return (
    <div className="bg-white border border-[#E9E9E9] rounded-xl p-4 space-y-4">
      {/* HEADER */}
      <div>
        <p className="text-xs text-gray-500">Machinery</p>
        <p className="font-semibold text-sm">{item.name}</p>
      </div>

      {/* GRID INFO */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info label="Total Bids" value={item.bids_count} />
        <Info label="Start Price" value={item.bid_start_price} />
        <Info label="Bid End Time" value={item.bid_end_time} />
      </div>

      {/* STATUS + ACTION */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E9E9E9]">
        <span
          className={`px-4 py-1 rounded-md text-sm ${
            statusMap[item.bid_status]
          }`}
        >
          {statusLabel[item.bid_status]}
        </span>

        <button
          onClick={onEdit}
          className="w-9 h-9 flex items-center justify-center rounded-full text-yellow-500 hover:bg-blue-50"
        >
          <BiEdit size={18} />
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
