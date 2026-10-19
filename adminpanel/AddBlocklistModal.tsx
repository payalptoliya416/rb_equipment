"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { adminBlocklistService } from "@/api/admin/blocklist";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddBlocklistModal({ open, onClose, onSuccess }: Props) {
  const [type, setType] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedVal = value.trim();

    if (!trimmedVal) {
      toast.error(`Please enter a valid ${type}`);
      return;
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedVal)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await adminBlocklistService.create({
        type,
        value: trimmedVal,
        status,
      });

      if (res?.status !== false) {
        toast.success(res?.message || "Blocklist item added successfully");
        setValue("");
        setType("email");
        setStatus(1);
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message || "Failed to add blocklist item");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to add blocklist item");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setValue("");
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* BACKDROP */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* MODAL */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-border">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <Dialog.Title className="text-lg font-bold text-gray-900">
                  Add to Blocklist
                </Dialog.Title>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 cursor-pointer"
                >
                  <RxCross2 size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* TYPE SELECT */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Block Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setType("email")}
                      className={`py-2.5 px-4 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                        type === "email"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "border-border text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Email Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("phone")}
                      className={`py-2.5 px-4 rounded-lg text-sm font-medium border text-center transition-all cursor-pointer ${
                        type === "phone"
                          ? "bg-primary/10 border-primary text-primary font-semibold"
                          : "border-border text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Phone Number
                    </button>
                  </div>
                </div>

                {/* VALUE INPUT */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    {type === "email" ? "Email Address" : "Phone Number"}
                  </label>
                  <input
                    type={type === "email" ? "email" : "tel"}
                    placeholder={
                      type === "email"
                        ? "e.g. user@example.com"
                        : "e.g. 6158277764"
                    }
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 text-sm border rounded-lg border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                {/* STATUS */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-sm border rounded-lg border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg border border-border text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="gradient-btn px-5 py-2 text-sm text-white rounded-lg cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? "Adding..." : "Add to Blocklist"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
