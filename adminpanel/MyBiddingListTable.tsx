// "use client";

// import Image from "next/image";
// import React, { useState, useMemo } from "react";
// import { FaCaretUp, FaCaretDown } from "react-icons/fa";
// import { TooltipWrapper } from "./TooltipWrapper";
// import { HiOutlineTrash } from "react-icons/hi2";
// import AdminDataTable from "@/components/tables/AdminDataTable";

// /* ================= TYPES ================= */
// export interface MyBidRow {
//   id: string;
//   user_name: string;
//   email: string;
//   phone: string;
//   last_bid: number;
//   bidding_date: string;
//   isHighlighted?: boolean;
//   isWon?: boolean;
// }

// interface MyBidDataTableProps {
//   data: MyBidRow[];
//   loading?: boolean;
// }

// type SortKey = "user_name" | "email" | "phone" | "last_bid" | "bidding_date";

// /* ================= COMPONENT ================= */
// export default function MyBidDataTable({
//   data,
//   loading = false,
// }: MyBidDataTableProps) {
//   const [sortKey, setSortKey] = useState<SortKey | null>(null);
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
//   const [deleteId, setDeleteId] = useState<number | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   /* ================= SORT ================= */
//   const sortedData = useMemo(() => {
//     if (!sortKey) return data;

//     return [...data].sort((a, b) => {
//       const aVal = a[sortKey];
//       const bVal = b[sortKey];

//       if (typeof aVal === "number" && typeof bVal === "number") {
//         return sortDir === "asc" ? aVal - bVal : bVal - aVal;
//       }

//       return sortDir === "asc"
//         ? String(aVal).localeCompare(String(bVal))
//         : String(bVal).localeCompare(String(aVal));
//     });
//   }, [data, sortKey, sortDir]);

//   const toggleSort = (key: SortKey) => {
//     if (sortKey === key) {
//       setSortDir((p) => (p === "asc" ? "desc" : "asc"));
//     } else {
//       setSortKey(key);
//       setSortDir("asc");
//     }
//   };

//   const columns = [
//   {
//     key: "id",
//     header: "ID",
//   },
//   {
//     key: "name",
//     header: "Name",
//   },
//   {
//     key: "email",
//     header: "Email",
//   },
//   {
//     key: "action",
//     header: "Action",
//     render: (row: any) => (
//       <TooltipWrapper content="Delete Bidding">
//         <HiOutlineTrash
//           className="text-[#DD3623] cursor-pointer"
//           size={18}
//           onClick={() => setDeleteId(row.id)}
//         />
//       </TooltipWrapper>
//     ),
//   },
// ];

//   return (
//     <div className="w-full overflow-x-auto border border-[#E9E9E9] rounded-[10px] bg-white my-5">
//       <table className="min-w-[900px] w-full border-collapse">
//         {/* ================= HEADER ================= */}
//         <thead className="bg-[#F2F8F7]">
//           <tr>
//             {[
//               { key: "user_name", label: "User" },
//               { key: "email", label: "Email" },
//               { key: "phone", label: "Phone Number" },
//               { key: "bidding_date", label: "Bid Time" },
//               { key: "last_bid", label: "Current Bid" },
//               { key: "action", label: "Action" },
//             ].map((col, idx) => (
//               <th
//                 key={col.key}
//                 onClick={() => toggleSort(col.key as SortKey)}
//                 className={`px-[15px] py-[16px] text-sm font-medium text-[#373737]
//                 border border-[#E9E9E9] whitespace-nowrap cursor-pointer
//                 ${idx === 0 ? "rounded-tl-[10px]" : ""}
//                 ${idx === 4 ? "rounded-tr-[10px]" : ""}`}
//               >
//                 <div className="flex items-center justify-between gap-2 cursor-pointer">
//                   {col.label}
//                   <div className="flex flex-col leading-none">
//                     <FaCaretUp
//                       size={10}
//                       className={
//                         sortKey === col.key && sortDir === "asc"
//                           ? "text-black"
//                           : "text-gray-400"
//                       }
//                     />
//                     <FaCaretDown
//                       size={10}
//                       className={
//                         sortKey === col.key && sortDir === "desc"
//                           ? "text-black"
//                           : "text-gray-400"
//                       }
//                     />
//                   </div>
//                 </div>
//               </th>
//             ))}
//           </tr>
//         </thead>

//         {/* ================= BODY ================= */}
//         <tbody>
//           {sortedData.map((row, idx) => {
//             const bg = row.isWon
//               ? "bg-[#E6F9EF]" // 🟢 Won → Green
//               : row.isHighlighted
//               ? "bg-[#FFF7E3]" // 🟡 Highest → Yellow
//               : idx % 2 === 0
//               ? "bg-white"
//               : "bg-[#FAFAFA]";

//             return (
//               <tr key={row.id} className={`${bg} hover:bg-gray-50`}>
//                 {/* USER */}
//                 <td className="px-[15px] py-[14px] border border-[#E9E9E9]">
//                   <div className="flex items-center gap-2">
//                     {row.isWon ? (
//                       <span className="w-2 h-2 rounded-full bg-[#34C759]" /> // 🟢 Winner
//                     ) : row.isHighlighted ? (
//                       <span className="w-2 h-2 rounded-full bg-[#3C97FF]" /> // 🔵 Highest
//                     ) : null}

//                     <span className="text-[#373737] font-medium whitespace-nowrap">
//                       {row.user_name}
//                     </span>
//                     {row.isWon &&
//                     <span className="py-[6px] px-[10px] text-white flex gap-[5px] items-center bg-[#35BB63] rounded-[4px] text-xs">
//                       <Image src="/assets/won.png" alt="won" width={12} height={12} /> Won
//                     </span>}
//                   </div>
//                 </td>

//                 {/* EMAIL */}
//                 <td className="px-[15px] py-[14px] border border-[#E9E9E9] text-[#555] whitespace-nowrap">
//                   {row.email}
//                 </td>

//                 {/* PHONE */}
//                 <td className="px-[15px] py-[14px] border border-[#E9E9E9] whitespace-nowrap">
//                   {row.phone}
//                 </td>

//                 {/* BID TIME */}
//                 <td className="px-[15px] py-[14px] border border-[#E9E9E9]">
//                   <span className="inline-block bg-[#F2F2F2] text-[#373737] text-xs px-3 py-1 rounded-md whitespace-nowrap">
//                     {row.bidding_date}
//                   </span>
//                 </td>

//                 {/* CURRENT BID */}
//                 <td className="px-[15px] py-[14px] border border-[#E9E9E9] font-semibold text-[#373737] whitespace-nowrap">
//                   ${row.last_bid.toLocaleString()}
//                 </td>
//                 <td className="px-[15px] py-[14px] border border-[#E9E9E9] font-semibold text-[#373737] whitespace-nowrap">
//                  <TooltipWrapper content="Delete Bidding">
//                       <HiOutlineTrash
//                         className="text-[#DD3623] cursor-pointer"
//                         size={18}
//                         // onClick={() => setDeleteId(row.id)}
//                       />
//                     </TooltipWrapper>
//                 </td>
//               </tr>
//             );
//           })}

//           {!loading && sortedData.length === 0 && (
//             <tr>
//               <td colSpan={6} className="py-10 text-center text-gray-500">
//                 No bids found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { TooltipWrapper } from "./TooltipWrapper";
import { HiOutlineTrash } from "react-icons/hi2";
import AdminDataTable from "@/components/tables/AdminDataTable";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import toast from "react-hot-toast";
import { adminBiddingService } from "@/api/admin/bidding";

/* ================= TYPES ================= */
export interface MyBidRow {
  id: string;
  user_name: string;
  email: string;
  phone: string;
  last_bid: number;
  bidding_date: string;
  isHighlighted?: boolean;
  isWon?: boolean;
}

interface MyBidDataTableProps {
  data: MyBidRow[];
  loading?: boolean;
  hideAction?: boolean;
    onRefresh?: () => void;  
}

/* ================= COMPONENT ================= */
export default function MyBidDataTable({
  data,
  loading = false,
  hideAction,
  onRefresh
}: MyBidDataTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ================= COLUMNS ================= */
  const columns = [
    {
      key: "user_name",
      header: "User",
      render: (row: MyBidRow) => (
        <div className="flex items-center gap-2">
          {row.isWon ? (
            <span className="w-2 h-2 rounded-full bg-[#34C759]" />
          ) : row.isHighlighted ? (
            <span className="w-2 h-2 rounded-full bg-[#3C97FF]" />
          ) : null}

          <span className="font-medium">{row.user_name}</span>

          {row.isWon && (
            <span className="px-2 py-1 text-white bg-green-500 rounded text-xs">
              Won
            </span>
          )}
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "phone",
      header: "Phone",
    },
    {
      key: "bidding_date",
      header: "Bid Time",
      render: (row: MyBidRow) => (
        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
          {row.bidding_date}
        </span>
      ),
    },
    {
      key: "last_bid",
      header: "Bid",
      render: (row: MyBidRow) => (
        <span className="font-semibold">${row.last_bid.toLocaleString()}</span>
      ),
    },
    !hideAction && {
      key: "action",
      header: "Action",
      render: (row: MyBidRow) => (
        <TooltipWrapper content="Delete Bidding">
          <HiOutlineTrash
            className="text-[#DD3623] cursor-pointer"
            size={18}
            onClick={() => setDeleteId(row.id)}
          />
        </TooltipWrapper>
      ),
    },
  ].filter(Boolean) as any;

  /* ================= PAGINATION MOCK ================= */
  const pagination = {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: data.length,
    from: 1,
    to: data.length,
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      await adminBiddingService.deleteBid(id);

      toast.success("Bid deleted successfully");
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to delete bid");
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      await handleDelete(deleteId);
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="my-5">
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => {
          console.log("page:", page);
        }}
        onPageSizeChange={(size) => {
          console.log("size:", size);
        }}
        rowClassName={(row, idx) => {
          if (row.isWon) return "bg-[#E6F9EF] hover:bg-green-50";
          if (row.isHighlighted) return "bg-[#FFF7E3] hover:bg-yellow-50";
          return idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]";
        }}
      />
      <ConfirmModal
        open={deleteId !== null}
        title="Delete Bid"
        description="Are you sure you want to delete this bid?"
        confirmText="Yes, Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
