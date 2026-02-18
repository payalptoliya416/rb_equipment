"use client";

import { FaFilePdf } from "react-icons/fa6";
import OrderStatusDropdown from "./OrderStatusDropdown";
import { IoReceiptSharp } from "react-icons/io5";

type Props = {
  order: any;
  onUpdated: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpenPaymentSlip: (order: any) => void;
};
function PaymentSlipBadge({
  status,
}: {
  status: "Pending" | "Approve" | "Decline";
}) {
  const config = {
    Pending: {
      dot: "bg-yellow-400",
      text: "text-yellow-700",
      bg: "bg-yellow-50",
      label: "Pending",
    },
    Approve: {
      dot: "bg-green-500",
      text: "text-green-700",
      bg: "bg-green-50",
      label: "Approved",
    },
    Decline: {
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      label: "Declined",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.bg} ${config.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default function OrderMobileCard({
  order,
  onUpdated,
  onView,
  onEdit,
  onDelete,
  onOpenPaymentSlip,
}: Props) {
  return (
    <div className="border border-[#E9E9E9] rounded-xl p-4 bg-white space-y-4">
      {/* Order ID */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500">Order ID</p>
          <p className="font-semibold">{order.orderId}</p>
        </div>
      </div>
      <div className="text-sm">
        <span className="text-gray-500">Machinery:</span>{" "}
        <span className="font-medium">{order.machineryName}</span>
      </div>

      <div className="border-t border-[#E9E9E9]" />

      {/* Fields */}
      <Field label="User Name" value={order.userName} />
      <Field label="Phone Number" value={order.phone} />
      <Field label="Order Date" value={order.orderDate} />
      <Field label="Order Amount" value={order.orderAmount} />
      {/* Payment Slip Status */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Payment Slip</span>

        <PaymentSlipBadge status={order.paymentSlipStatus} />
      </div>

      {/* Status */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Status</span>
        <OrderStatusDropdown
          value={order.status}
          orderId={order.id}
          onUpdated={onUpdated}
        />
      </div>
      <div className="flex justify-between items-start flex-col gap-2">
        <button
          onClick={() => onOpenPaymentSlip(order)}
          className="flex items-center gap-2 text-orange text-sm font-medium cursor-pointer">
          <IoReceiptSharp size={18} />
          Payment Slip
        </button>
        <button
          onClick={() =>
            order.invoiceUrl && window.open(order.invoiceUrl, "_blank")
          }
          disabled={!order.invoiceUrl}
          className={`mt-2 flex items-center gap-2 text-sm font-medium
    ${
      order.invoiceUrl
        ? "text-green cursor-pointer"
        : "text-gray-600 cursor-not-allowed opacity-50"
    }
  `}
        >
          <FaFilePdf size={20} />
          Invoice
        </button>
      </div>
      {/* Actions */}
      {/* <div className="flex justify-end gap-4 pt-4 border-t border-[#E9E9E9]">
        <button onClick={onEdit}><BiEdit /></button>
        <button onClick={onView}><BiEdit /></button>
        <button onClick={onDelete} className="text-red-500">
          <HiOutlineTrash />
        </button>
      </div> */}
    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}
