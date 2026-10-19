"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDataTable, { Column } from "@/components/tables/AdminDataTable";
import { FiSearch, FiMail, FiPhone } from "react-icons/fi";
import { HiOutlineTrash } from "react-icons/hi2";
import { BiEdit } from "react-icons/bi";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/tables/ConfirmDialog";
import { useIsMobile } from "@/hooks/useIsMobile";
import BlocklistMobileCard from "@/adminpanel/BlocklistMobileCard";
import BlocklistStatusDropdown from "@/adminpanel/BlocklistStatusDropdown";
import Loader from "@/components/common/Loader";
import { TooltipWrapper } from "@/adminpanel/TooltipWrapper";
import {
  adminBlocklistService,
  BlocklistApiItem,
} from "@/api/admin/blocklist";

export default function AdminBlocklistPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  /* ================= STATE ================= */
  const [data, setData] = useState<BlocklistApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pagination, setPagination] = useState<any>(null);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchBlocklists = async () => {
    try {
      setLoading(true);

      const res = await adminBlocklistService.getBlocklists({
        search,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (!res?.data || res.data.length === 0) {
        setData([]);
        setPagination(res?.pagination ?? null);
        setNoDataMessage(res?.message || "No blocklist items found");
        return;
      }

      setData(res.data);
      setPagination(res.pagination ?? null);
      setNoDataMessage(null);
    } catch (error: any) {
      console.error("Error fetching blocklists:", error);
      setData([]);
      setPagination(null);
      setNoDataMessage("Failed to fetch blocklist data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocklists();
  }, [search, page, perPage, sortBy, sortOrder]);

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(true);
      const res = await adminBlocklistService.delete(id);

      if (res?.status !== false) {
        toast.success(res?.message || "Blocklist item deleted successfully");
        if (data.length === 1 && page > 1) {
          setPage((p) => p - 1);
        } else {
          fetchBlocklists();
        }
      } else {
        toast.error(res?.message || "Failed to delete blocklist item");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete blocklist item");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  /* ================= SORT HANDLER ================= */
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  /* ================= TABLE COLUMNS ================= */
  const columns: Column<BlocklistApiItem>[] = [
    {
      key: "id",
      header: "ID",
      sortable: true,
      onSort: () => handleSort("id"),
      render: (row) => (
        <span className="font-semibold text-gray-700">#{row.id}</span>
      ),
      className: "w-[80px]",
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      onSort: () => handleSort("type"),
      render: (row) => {
        const isEmail = row.type?.toLowerCase() === "email";
        return (
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-md flex items-center justify-center text-xs ${
                isEmail
                  ? "bg-blue-50 text-blue-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isEmail ? <FiMail size={14} /> : <FiPhone size={14} />}
            </span>
            <span className="capitalize font-medium text-gray-800 text-sm">
              {row.type}
            </span>
          </div>
        );
      },
      className: "w-[130px]",
    },
    {
      key: "value",
      header: "Value",
      sortable: true,
      onSort: () => handleSort("value"),
      render: (row) => (
        <span className="font-medium text-gray-900 break-all">{row.value}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      onSort: () => handleSort("status"),
      render: (row) => (
        <BlocklistStatusDropdown item={row} onUpdated={fetchBlocklists} />
      ),
      className: "w-[130px]",
    },
    {
      key: "created_at",
      header: "Created Date",
      sortable: true,
      onSort: () => handleSort("created_at"),
      render: (r) => (
        <span className="bg-[#ECECEC] px-3 py-1 rounded-md text-xs sm:text-sm text-gray-700 font-normal">
          {r.formatted_created_at ||
            (r.created_at
              ? new Date(r.created_at).toLocaleDateString()
              : "-")}
        </span>
      ),
      className: "w-[170px]",
    },
    {
      key: "updated_at",
      header: "Last Updated",
      sortable: true,
      onSort: () => handleSort("updated_at"),
      render: (r) => (
        <span className="bg-[#ECECEC] px-3 py-1 rounded-md text-xs sm:text-sm text-gray-700 font-normal">
          {r.formatted_updated_at ||
            (r.updated_at
              ? new Date(r.updated_at).toLocaleDateString()
              : "-")}
        </span>
      ),
      className: "w-[170px]",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-3">
          <TooltipWrapper content="Edit Blocklist">
            <button
              onClick={() => router.push(`/admin/blocklist/add?id=${row.id}`)}
              className="text-[#EDB423] hover:text-[#d49f1b] transition-transform hover:scale-110 cursor-pointer flex items-center justify-center"
            >
              <BiEdit size={18} />
            </button>
          </TooltipWrapper>

          <TooltipWrapper content="Delete Blocklist">
            <button
              onClick={() => setDeleteId(row.id)}
              className="text-[#DD3623] hover:text-red-700 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center"
            >
              <HiOutlineTrash size={18} />
            </button>
          </TooltipWrapper>
        </div>
      ),
      className: "w-[100px]",
    },
  ];

  return (
    <div className="space-y-5 bg-white border border-border rounded-[14px] p-3 sm:p-5">
      {/* TOP BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* SEARCH */}
        <div className="relative w-full sm:w-[260px]">
          <FiSearch
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-seclightgray"
          />
          <input
            type="text"
            placeholder="Search blocklist...."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full py-[12px] pl-[44px] pr-4 text-sm border rounded-lg border-border focus:outline-none focus:border-primary"
          />
        </div>

        {/* ADD BUTTON */}
        <button
          onClick={() => router.push("/admin/blocklist/add")}
          className="gradient-btn px-5 py-[12px] text-sm text-white rounded-lg cursor-pointer transition-all duration-200 ease-in-out
            hover:brightness-110 hover:shadow-md active:brightness-90 active:scale-95 flex items-center gap-1.5"
        >
          <span>+ Add Blocklist</span>
        </button>
      </div>

      {/* MOBILE OR DESKTOP TABLE */}
      {isMobile ? (
        <div className="space-y-4">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader />
            </div>
          )}

          {!loading && data.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">
              {noDataMessage || "No blocklist items found"}
            </p>
          )}

          {!loading &&
            data.map((item) => (
              <BlocklistMobileCard
                key={item.id}
                item={item}
                onEdit={() => router.push(`/admin/blocklist/add?id=${item.id}`)}
                onDelete={() => setDeleteId(item.id)}
                onUpdated={fetchBlocklists}
              />
            ))}
        </div>
      ) : (
        <AdminDataTable
          columns={columns}
          data={data}
          loading={loading}
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPage(1);
            setPerPage(size);
          }}
          noDataMessage={noDataMessage}
        />
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        open={deleteId !== null}
        title="Delete Blocklist Item"
        description="Are you sure you want to delete this blocklist entry? This action cannot be undone."
        confirmText="Yes, Delete"
        loading={deleteLoading}
        onConfirm={() => deleteId !== null && handleDelete(deleteId)}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
