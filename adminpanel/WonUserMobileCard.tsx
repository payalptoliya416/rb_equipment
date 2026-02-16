"use client";

import { HiOutlineEye } from "react-icons/hi2";

type Props = {
  item: any;
  onView: () => void;
};

const statusClassMap: Record<string, string> = {
  Pending: "bg-yellow-400 text-black",
  Send: "bg-purple-500 text-white",
  Signed: "bg-blue-500 text-white",
  Approved: "bg-green-500 text-white",
  Rejected: "bg-red-500 text-white",
  Unknown: "bg-gray-400 text-white",
};

export default function WonUserMobileCard({ item, onView }: Props) {
  return (
    <div className="bg-white border border-[#E9E9E9] rounded-xl p-4 space-y-4">
      {/* USER + MACHINE */}
      <div>
        <p className="text-xs text-gray-500">Won User</p>
        <p className="font-semibold">{item.userName}</p>

        <p className="text-xs text-gray-500 mt-2">Machinery</p>
        <p className="font-medium">{item.machineryName}</p>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <Info label="Phone" value={item.phone} />
        <Info label="Won Price" value={item.wonBidPrice} />
      </div>

      {/* STATUS + ACTION */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E9E9E9]">
        <span
          className={`px-4 py-1 rounded-md text-sm ${
            statusClassMap[item.status] || "bg-gray-400 text-white"
          }`}
        >
          {item.status}
        </span>

        <button
          onClick={onView}
          className="w-9 h-9 flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-50"
        >
          <HiOutlineEye size={18} />
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
