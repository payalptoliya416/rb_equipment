"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import BankDetailsEditor from "./BankDetailsEditor";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (bankDetails: string) => void;
  loading: boolean;
}

const Schema = Yup.object({
  bankDetails: Yup.string()
    .min(10, "Minimum 10 characters required")
    .required("Bank details are required"),
});

export default function ApproveContractModal({
  open,
  onClose,
  onSubmit,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Add Bank Details Before Approval
        </h2>

        <Formik
          initialValues={{ bankDetails: "" }}
          validationSchema={Schema}
          onSubmit={(values) => {
            onSubmit(values.bankDetails);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <BankDetailsEditor name="bankDetails" />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border rounded-md text-sm cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="px-5 py-2 bg-[#22C55E] text-white rounded-md text-sm flex items-center gap-2 cursor-pointer"
                >
                  {loading && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Approve
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}