"use client";

import { FaFilePdf } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { adminOrdersService } from "@/api/admin/orders";
import { useState } from "react";
import { FaRegImage } from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  orderId: number;
  slipUrl?: string;
  onUpdated: () => void;
  paymentSlipStatus: "Pending" | "Approve" | "Decline";
};

export default function PaymentSlipModal({
  open,
  onClose,
  orderId,
  slipUrl,
  onUpdated,
  paymentSlipStatus,
}: Props) {
  if (!open) return null;
  const isFinalized = paymentSlipStatus !== "Pending";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingStatus, setSubmittingStatus] = useState<
    null | "approve" | "decline"
  >(null);

  const updateStatus = async (status: 1 | 2) => {
    if (submittingStatus) return; // ⛔ guard

    const current = status === 1 ? "approve" : "decline";

    try {
      setSubmittingStatus(current);

      await adminOrdersService.updatePaymentSlipStatus({
        order_id: orderId,
        status,
      });

      toast.success("Payment slip status updated");
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSubmittingStatus(null);
    }
  };

  const isPdf = (url?: string) => !!url && url.toLowerCase().endsWith(".pdf");

  const isImage = (url?: string) =>
    !!url &&
    (url.toLowerCase().endsWith(".jpg") ||
      url.toLowerCase().endsWith(".jpeg") ||
      url.toLowerCase().endsWith(".png") ||
      url.toLowerCase().endsWith(".webp"));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-light-gray">
          <h2 className="text-lg font-semibold text-gray-800">Payment Slip</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          <div className="border border-dashed rounded-xl p-4 flex justify-center items-center bg-gray-50 min-h-[140px] sm:min-h-[180px]">
            {slipUrl ? (
              <a
                href={slipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 text-green hover:opacity-80"
              >
                {isImage(slipUrl) ? (
                  <>
                    <FaRegImage size={40} />
                    <span className="text-sm font-medium">Open Image Slip</span>
                  </>
                ) : (
                  <>
                    <FaFilePdf size={40} />
                    <span className="text-sm font-medium">Open PDF Slip</span>
                  </>
                )}
              </a>
            ) : (
              <p className="text-gray-500 text-xs text-center">
                No payment slip uploaded
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              disabled={!slipUrl || isFinalized || submittingStatus !== null}
              onClick={() => updateStatus(2)}
              className={`px-4 py-2 rounded-lg text-sm font-medium
            ${
            !slipUrl || isFinalized || submittingStatus !== null
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer"
            }`}
            >
              {submittingStatus === "decline" ? "Processing..." : "Decline"}
            </button>
            <button
              disabled={!slipUrl || isFinalized || submittingStatus !== null}
              onClick={() => updateStatus(1)}
              className={`px-5 py-2 rounded-lg text-sm font-medium
                ${
                !slipUrl || isFinalized || submittingStatus !== null
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green text-white hover:bg-green cursor-pointer"
                }`}
            >
              {submittingStatus === "approve" ? "Processing..." : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
