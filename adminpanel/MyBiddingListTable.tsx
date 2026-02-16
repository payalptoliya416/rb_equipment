"use client";

import Image from "next/image";
import React, { useState, useMemo } from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

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
}

type SortKey = "user_name" | "email" | "phone" | "last_bid" | "bidding_date";

/* ================= COMPONENT ================= */
export default function MyBidDataTable({
  data,
  loading = false,
}: MyBidDataTableProps) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  /* ================= SORT ================= */
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="w-full overflow-x-auto border border-[#E9E9E9] rounded-[10px] bg-white my-5">
      <table className="min-w-[900px] w-full border-collapse">
        {/* ================= HEADER ================= */}
        <thead className="bg-[#F2F8F7]">
          <tr>
            {[
              { key: "user_name", label: "User" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone Number" },
              { key: "bidding_date", label: "Bid Time" },
              { key: "last_bid", label: "Current Bid" },
            ].map((col, idx) => (
              <th
                key={col.key}
                onClick={() => toggleSort(col.key as SortKey)}
                className={`px-[15px] py-[16px] text-sm font-medium text-[#373737]
                border border-[#E9E9E9] whitespace-nowrap cursor-pointer
                ${idx === 0 ? "rounded-tl-[10px]" : ""}
                ${idx === 4 ? "rounded-tr-[10px]" : ""}`}
              >
                <div className="flex items-center justify-between gap-2 cursor-pointer">
                  {col.label}
                  <div className="flex flex-col leading-none">
                    <FaCaretUp
                      size={10}
                      className={
                        sortKey === col.key && sortDir === "asc"
                          ? "text-black"
                          : "text-gray-400"
                      }
                    />
                    <FaCaretDown
                      size={10}
                      className={
                        sortKey === col.key && sortDir === "desc"
                          ? "text-black"
                          : "text-gray-400"
                      }
                    />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ================= BODY ================= */}
        <tbody>
          {sortedData.map((row, idx) => {
            const bg = row.isWon
              ? "bg-[#E6F9EF]" // 🟢 Won → Green
              : row.isHighlighted
              ? "bg-[#FFF7E3]" // 🟡 Highest → Yellow
              : idx % 2 === 0
              ? "bg-white"
              : "bg-[#FAFAFA]";

            return (
              <tr key={row.id} className={`${bg} hover:bg-gray-50`}>
                {/* USER */}
                <td className="px-[15px] py-[14px] border border-[#E9E9E9]">
                  <div className="flex items-center gap-2">
                    {row.isWon ? (
                      <span className="w-2 h-2 rounded-full bg-[#34C759]" /> // 🟢 Winner
                    ) : row.isHighlighted ? (
                      <span className="w-2 h-2 rounded-full bg-[#3C97FF]" /> // 🔵 Highest
                    ) : null}

                    <span className="text-[#373737] font-medium whitespace-nowrap">
                      {row.user_name}
                    </span>
                    {row.isWon && 
                    <span className="py-[6px] px-[10px] text-white flex gap-[5px] items-center bg-[#35BB63] rounded-[4px] text-xs">
                      <Image src="/assets/won.png" alt="won" width={12} height={12} /> Won
                    </span>}
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-[15px] py-[14px] border border-[#E9E9E9] text-[#555] whitespace-nowrap">
                  {row.email}
                </td>

                {/* PHONE */}
                <td className="px-[15px] py-[14px] border border-[#E9E9E9] whitespace-nowrap">
                  {row.phone}
                </td>

                {/* BID TIME */}
                <td className="px-[15px] py-[14px] border border-[#E9E9E9]">
                  <span className="inline-block bg-[#F2F2F2] text-[#373737] text-xs px-3 py-1 rounded-md whitespace-nowrap">
                    {row.bidding_date}
                  </span>
                </td>

                {/* CURRENT BID */}
                <td className="px-[15px] py-[14px] border border-[#E9E9E9] font-semibold text-[#373737] whitespace-nowrap">
                  ${row.last_bid.toLocaleString()}
                </td>
              </tr>
            );
          })}

          {!loading && sortedData.length === 0 && (
            <tr>
              <td colSpan={5} className="py-10 text-center text-gray-500">
                No bids found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
