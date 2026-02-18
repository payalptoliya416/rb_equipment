"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DeliveryStatus,
  DeliveryTimelineItem,
  OrderApiItem,
  orderService,
} from "@/api/user/bids";
import Loader from "@/components/common/Loader";
import { formatPrice } from "@/hooks/formate";
import { IoCallOutline } from "react-icons/io5";
import Accordion from "@/api/user/Accordion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa6";
import { FiUploadCloud } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa";
/* ================= TYPES ================= */

type OrderData = {
  id?: number;
  order_id: string;
  name: string;
  first_image: string;
  working_hours: string;
  weight: string;
  year: string;
  price: string;
  serial_no: string;
  delivery_contact: string | null;
  delivery_status_text: DeliveryStatus;
  delivery_timeline: DeliveryTimelineItem[];
  invoice_url?: string;
  payment_slip_url?: string | null;
};

type UIStepStatus = DeliveryStatus | "Confirmation";
/* ================= HELPERS ================= */
const statusToStep: Record<DeliveryStatus, number> = {
  Pending: 0,
  Confirmation: 1,
  Process: 2,
  Shipped: 3,
  "In Transit": 4,
  Delivered: 5,
  Cancelled: 6, // optional handling
};

const STEPS: { key: DeliveryStatus; title: string }[] = [
  { key: "Pending", title: "Pending" },
  { key: "Confirmation", title: "Confirmation" },
  { key: "Process", title: "Processing" },
  { key: "Shipped", title: "Shipped" },
  { key: "In Transit", title: "In Transit" },
  { key: "Delivered", title: "Delivered" },
];

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

/* ================= PAGE ================= */

export default function MyBuyOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(
    null,
  );
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const mapOrderApiToUI = (item: OrderApiItem): OrderData => ({
    id: item.id,
    order_id: item.order_id,
    name: item.name,
    first_image: item.first_image ?? "",
    working_hours: item.working_hours,
    weight: item.weight,
    year: item.year,
    price: item.price,
    serial_no: item.serial_no,
    delivery_contact: item.delivery_contact,
    delivery_status_text: item.delivery_status_text as DeliveryStatus,
    delivery_timeline: item.delivery_timeline,
    invoice_url: item.invoice_url,
    payment_slip_url: item.payment_slip_url ?? null,
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(""); // 👈 important
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await orderService.getOrders({
        page,
        per_page: perPage,
        search,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      if (res.success) {
        if (!res.data || res.data.length === 0) {
          setOrders([]);
          setTotalPages(1);
          setNoDataMessage("No orders found");
          return;
        }

        setOrders(res.data.map(mapOrderApiToUI));
        setTotalPages(res.pagination.last_page);
      }
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, perPage, search, sortBy, sortOrder]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const uploadPaymentSlip = async () => {
    if (!paymentFile || !selectedOrderId) {
      setErrorMsg("Please upload payment slip");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const base64 = await fileToBase64(paymentFile);

      const res = await orderService.uploadPaymentSlip({
        order_id: selectedOrderId,
        payment_slip: base64,
      });

      if (res.success) {
        setSuccessMsg(res.message || "Payment slip uploaded successfully");
        setPaymentFile(null);
        setOpenConfirmationModal(false);
        fetchOrders();
        setTimeout(() => {
          setSuccessMsg(null);
        }, 2000);
      } else {
        setErrorMsg(res.message || "Upload failed");
      }
    } catch (err) {
      setErrorMsg("Something went wrong while uploading");
    } finally {
      setUploading(false);
    }
  };

  const isPdf = (url?: string | null) =>
    !!url && url.toLowerCase().endsWith(".pdf");

  const isImage = (url?: string | null) =>
    !!url &&
    (url.toLowerCase().endsWith(".jpg") ||
      url.toLowerCase().endsWith(".jpeg") ||
      url.toLowerCase().endsWith(".png") ||
      url.toLowerCase().endsWith(".webp"));

  const getCurrentStepFromTimeline = (timeline: DeliveryTimelineItem[]) => {
    if (!timeline || timeline.length === 0) return 0;

    const max = Math.max(...timeline.map((t) => t.status_code));
    return max;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <section className="py-11 sm:py-[60px]">
      <div className="container-custom mx-auto">
        <h1 className="text-[#373737] text-[26px] font-bold mb-6">
          My Buy It Now Orders
        </h1>
        {!loading && orders.length === 0 && (
          <div className="flex items-center justify-center min-h-[30vh]">
            <h2 className="text-lg sm:text-xl font-medium text-gray-600">
              No Orders Found
            </h2>
          </div>
        )}
        <div className="space-y-6">
          {orders.map((data) => {
            const step = getCurrentStepFromTimeline(data.delivery_timeline);
            const MAX_STEP = STEPS.length - 1;

            const safeStep = Math.min(step, MAX_STEP);
            const isConfirmed = !!data.payment_slip_url;
            const confirmationDate = isConfirmed
              ? new Date().toISOString()
              : null;
            return (
              <Accordion
                key={data.order_id}
                open={openOrderId === data.order_id}
                onToggle={() =>
                  setOpenOrderId((prev) =>
                    prev === data.order_id ? null : data.order_id,
                  )
                }
                header={
                  <div className="p-[15px]">
                    <div className="grid grid-cols-12 items-center gap-5">
                      <div className="col-span-12 lg:col-span-7 lg:flex gap-5 items-center">
                        <div className=" rounded flex justify-center items-center mb-5 lg:mb-0">
                          <Image
                            src={data.first_image}
                            alt={data.name}
                            width={110}
                            height={80}
                          />
                        </div>

                        <div>
                          <h2 className="mb-4 text-xl text-[#373737]">
                            {data.name}
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#7A7A7A]">
                            <p>Hours: {data.working_hours}</p>
                            <p>Total Weight: {data.weight}</p>
                            <p>Year: {data.year}</p>
                            {data.invoice_url && (
                              <div className="flex items-center gap-3">
                                <a
                                  href={data.invoice_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-1 rounded-lg
                                    text-sm text-[#373737] hover:bg-gray-100 transition"
                                >
                                  <FaFilePdf className="text-lg text-green" />
                                  <span>View Invoice</span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-5 lg:text-right">
                        <h2 className="text-green text-[22px] mb-4 font-semibold">
                          {formatPrice(data.price)}
                        </h2>
                        <p className="text-[#646464] mb-2">Serial Number</p>
                        <span className="py-1 px-2 text-sm rounded bg-[#E9E9E9]">
                          {data.serial_no}
                        </span>
                      </div>
                    </div>
                  </div>
                }
              >
                {/* ================= BODY ================= */}

                <div className="flex justify-between mb-10 flex-wrap gap-5">
                  <div>
                    <h3 className="text-xl font-medium">Order ID</h3>
                    <p className="text-[#7A7A7A]">#{data.order_id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-xl font-medium">Delivery Contact</h3>
                      <p className="text-[#7A7A7A]">(603) 555-0123</p>
                    </div>
                    <div className="w-[38px] h-[38px] flex justify-center items-center rounded-full bg-[#E9E9E9]">
                      <IoCallOutline />
                    </div>
                  </div>
                </div>

                {/* ================= TIMELINE ================= */}

                <div className="grid grid-cols-1 lg:grid-cols-6 relative z-20">
                  {/* BACK LINE */}
                  <div
                    className="hidden lg:block absolute top-[18px] h-[6px] bg-[#E8E8E8] rounded -z-10"
                    style={{
                      left: "calc(50% / 6)",
                      right: "calc(50% / 6)",
                    }}
                  />
                  {/* ACTIVE LINE */}
                  <div
                    className="hidden lg:block absolute top-[18px] h-[6px] bg-[#0A7F71] rounded -z-10 transition-all"
                    style={{
                      left: "calc(50% / 6)",
                      width: `calc(${Math.min(step, STEPS.length - 1)} * (100% / 6))`,
                    }}
                  />

                  {STEPS.map((s, idx) => {
                    const completed =
                      s.key === "Confirmation" ? isConfirmed : step >= idx;

                    const item =
                      s.key === "Confirmation"
                        ? null
                        : data.delivery_timeline?.find(
                            (t) => t.status === s.key,
                          );
                    return (
                      <div
                        key={s.key}
                        onClick={() => {
                          if (s.key === "Confirmation") {
                            setSelectedOrderId(data.id!);
                            setSelectedOrderNumber(data.order_id);
                            setOpenConfirmationModal(true);
                            setPaymentFile(null);
                          }
                        }}
                        className={`flex lg:flex-col gap-3 items-start lg:items-center mb-8 lg:mb-0 ${s.key === "Confirmation" ? "cursor-pointer group" : ""}`}
                      >
                        <div
                          className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition
                        ${
                          s.key === "Confirmation"
                            ? "bg-[#E6F4F1] group-hover:scale-110 group-hover:ring-1 group-hover:ring-green"
                            : completed
                              ? "bg-[#CCE4E1]"
                              : "bg-[#E9E9E9]"
                        }`}
                        >
                          <div
                            className={`w-[22px] h-[22px] rounded-full ${
                              completed ? "bg-[#0A7F71]" : "bg-[#D3D3D3]"
                            }`}
                          />
                        </div>

                        <div className="lg:text-center">
                          <h3
                            className={`text-lg font-medium ${
                              s.key === "Confirmation"
                                ? "text-green"
                                : "text-[#373737]"
                            }`}
                          >
                            {s.title}
                          </h3>

                          {s.key === "Confirmation" && (
                            <>
                              {!isConfirmed ? (
                                <p className="text-xs text-green mt-1">
                                  Click to upload payment slip
                                </p>
                              ) : (
                                <p className="text-sm text-[#7A7A7A]">
                                  {formatDateTime(confirmationDate!)}
                                </p>
                              )}
                            </>
                          )}

                          {item?.date && (
                            <p className="text-sm text-[#7A7A7A]">
                              {formatDateTime(item.date)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Accordion>
            );
          })}
        </div>
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 sm:gap-2 justify-center mt-10 flex-wrap">
            {/* PREV */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`flex items-center gap-2 w-8 sm:w-auto sm:px-3 justify-center py-2
                border border-light-gray rounded-md sm:rounded-xl text-text-gray transition-all
                h-8 sm:h-11 text-xs sm:text-base cursor-pointer
                ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              <FaChevronLeft className="text-xs sm:text-sm" />
              <span className="hidden md:block">Back</span>
            </button>

            {/* PAGE NUMBERS */}
            {(() => {
              let pages: (number | string)[] = [];

              if (totalPages <= 6) {
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                pages.push(1);

                if (page > 3) pages.push("...");

                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (page < totalPages - 2) pages.push("...");

                pages.push(totalPages);
              }

              return pages.map((p, index) =>
                p === "..." ? (
                  <span
                    key={`dots-${index}`}
                    className="px-1 sm:px-2 text-gray-400 font-semibold text-xs sm:text-base"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center
                      rounded-md sm:rounded-xl transition-all text-xs sm:text-base  cursor-pointer
                      ${
                        page === p
                          ? "bg-green text-white"
                          : "border border-light-gray text-text-gray hover:bg-gray-100"
                      }`}
                  >
                    {p}
                  </button>
                ),
              );
            })()}

            {/* NEXT */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`flex items-center gap-2 w-8 sm:w-auto sm:px-3 justify-center py-2
                border border-light-gray rounded-md sm:rounded-xl text-text-gray transition-all
                h-8 sm:h-11 text-xs sm:text-base  cursor-pointer
                ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              <span className="hidden md:block">Next</span>
              <FaChevronRight className="text-xs sm:text-sm" />
            </button>
          </div>
        )}
      </div>
      {openConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div
            className="
        bg-white rounded-2xl shadow-xl w-full max-w-md
        max-h-[90vh] overflow-y-auto
        p-5 sm:p-6
      "
          >
            {/* TITLE */}
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              Order Confirmation
            </h2>

            <p className="text-gray-600 text-sm mb-5">
              Please upload the payment slip for order
              <span className="font-semibold"> #{selectedOrderNumber}</span>.
            </p>

            {/* UPLOAD BOX */}
            {!orders.find((o) => o.id === selectedOrderId)?.payment_slip_url ? (
              /* ================= UPLOAD BOX ================= */
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-green transition">
                <input
                  type="file"
                  accept=".pdf,image/png,image/jpeg"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPaymentFile(e.target.files[0]);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }
                  }}
                />

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green/10 flex items-center justify-center text-green">
                    <FiUploadCloud size={22} />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload payment slip
                  </p>

                  <p className="text-xs text-gray-500">
                    PDF, JPG or PNG (max 10MB)
                  </p>
                </div>
              </label>
            ) : (
              /* ================= ALREADY UPLOADED ================= */
              <div className="border rounded-xl p-4 bg-green/5">
                <p className="text-sm text-green font-medium mb-2">
                  Payment slip already uploaded
                </p>

                <a
                  href={
                    orders.find((o) => o.id === selectedOrderId)
                      ?.payment_slip_url!
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition"
                >
                  {isImage(
                    orders.find((o) => o.id === selectedOrderId)
                      ?.payment_slip_url,
                  ) ? (
                    <FaRegImage className="text-blue-600 text-xl" />
                  ) : (
                    <FaFilePdf className="text-red-600 text-xl" />
                  )}

                  <span className="text-sm text-gray-700">
                    View Payment Slip
                  </span>
                </a>
              </div>
            )}

            {/* FILE PREVIEW */}
            {paymentFile && (
              <div className="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                {paymentFile.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(paymentFile)}
                    alt="Payment Slip Preview"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-md bg-red-100 text-red-600 text-xl">
                    📄
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {paymentFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(paymentFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={() => setPaymentFile(null)}
                  className="text-gray-400 hover:text-red-500 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* SUCCESS / ERROR */}
            {successMsg && (
              <p className="text-green-600 text-sm mt-4 font-medium">
                {successMsg}
              </p>
            )}

            {errorMsg && (
              <p className="text-red-500 text-sm mt-4">{errorMsg}</p>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setOpenConfirmationModal(false)}
                disabled={uploading}
                className="px-4 py-1 rounded-lg border text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={uploadPaymentSlip}
                disabled={
                  uploading ||
                  !!orders.find((o) => o.id === selectedOrderId)
                    ?.payment_slip_url
                }
                className="px-5 py-1 rounded-lg bg-green text-white font-medium disabled:opacity-50 cursor-pointer"
              >
                {uploading ? "Uploading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
