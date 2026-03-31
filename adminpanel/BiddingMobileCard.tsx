"use client";

import { HiOutlineEye } from "react-icons/hi2";
import { HiArrowPath } from "react-icons/hi2";
import BiddingStatusDropdown from "./BiddingStatusDropdown";

type Props = {
  item: any;
  onEdit: () => void;
  loadingViewId?: number | null;
};

export default function BiddingMobileCard({
  item,
  onEdit,
  loadingViewId,
}: Props) {
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
        <BiddingStatusDropdown
          value={item.bid_status}
          biddingId={item.id}
          onUpdated={onEdit} // 🔥 or fetch function if available
        />

        <button
          disabled={loadingViewId === item.id}
          onClick={onEdit}
          className="w-9 h-9 flex items-center justify-center rounded-full text-[#3C97FF]"
        >
          {loadingViewId === item.id ? (
            <HiArrowPath size={18} className="text-[#3C97FF] animate-spin" />
          ) : (
            <HiOutlineEye size={18} />
          )}
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
