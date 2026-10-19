"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FiArrowLeft, FiMail, FiPhone } from "react-icons/fi";
import { adminBlocklistService } from "@/api/admin/blocklist";
import Loader from "@/components/common/Loader";

/* ================= VALIDATION SCHEMA ================= */
const schema = Yup.object().shape({
  type: Yup.string()
    .oneOf(["email", "phone"], "Type must be either Email or Phone")
    .required("Type is required"),
  value: Yup.string()
    .trim()
    .required("Value is required")
    .test("is-valid-format", function (val) {
      const { type } = this.parent;
      if (!val) return false;
      if (type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          return this.createError({
            message: "Please enter a valid email address",
          });
        }
      } else if (type === "phone") {
        const cleaned = val.replace(/[\s\-\(\)\+]/g, "");
        if (!/^\d{6,15}$/.test(cleaned)) {
          return this.createError({
            message: "Please enter a valid phone number (6-15 digits)",
          });
        }
      }
      return true;
    }),
  status: Yup.number().oneOf([0, 1]).required("Status is required"),
});

const DEFAULT_VALUES = {
  type: "email",
  value: "",
  status: 1,
};

export default function AddBlocklistClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);

  const [initialValues, setInitialValues] = useState(DEFAULT_VALUES);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA FOR EDIT ================= */
  useEffect(() => {
    if (!isEdit || !editId) return;

    const fetchSingle = async () => {
      try {
        setLoading(true);
        const res = await adminBlocklistService.show(Number(editId));

        if (!res?.data) {
          toast.error(res?.message || "Failed to load blocklist entry");
          router.push("/admin/blocklist");
          return;
        }

        const item = res.data;
        setInitialValues({
          type: item.type?.toLowerCase() === "phone" ? "phone" : "email",
          value: item.value || "",
          status: item.status === 1 ? 1 : 0,
        });
      } catch (err: any) {
        toast.error(err?.message || "Failed to load blocklist data");
        router.push("/admin/blocklist");
      } finally {
        setLoading(false);
      }
    };

    fetchSingle();
  }, [isEdit, editId]);

  if (isEdit && loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER WITH BACK BUTTON */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/blocklist")}
          className="w-10 h-10 rounded-lg border border-border bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {isEdit ? "Edit Blocklist Entry" : "Add to Blocklist"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEdit
              ? "Update blocked email address or phone number"
              : "Block a specific email address or phone number from accessing the system"}
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const payload = {
              type: values.type,
              value: values.value.trim(),
              status: Number(values.status),
            };

            if (isEdit) {
              const res = await adminBlocklistService.update({
                id: Number(editId),
                ...payload,
              });

              if (res?.status === false) {
                throw res;
              }

              toast.success(res?.message || "Blocklist updated successfully");
            } else {
              const res = await adminBlocklistService.create(payload);

              if (res?.status === false) {
                throw res;
              }

              toast.success(res?.message || "Blocklist added successfully");
            }

            router.push("/admin/blocklist");
          } catch (err: any) {
            // Handle field validation errors from backend
            if (err?.errors && typeof err.errors === "object") {
              const fieldErrors: Record<string, string> = {};
              Object.entries(err.errors).forEach(([field, msgs]: [string, any]) => {
                const msg = Array.isArray(msgs) ? msgs[0] : String(msgs);
                fieldErrors[field] = msg;
                toast.error(msg);
              });
              setErrors(fieldErrors);
            } else {
              toast.error(err?.message || "Something went wrong");
            }
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          touched,
          values,
          setFieldValue,
          handleChange,
          isSubmitting,
        }) => (
          <Form className="bg-white border border-border rounded-[14px] p-5 sm:p-7 space-y-6 max-w-3xl">
            {/* TYPE SELECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Block Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("type", "email");
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    values.type === "email"
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiMail size={18} />
                  <span>Email Address</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("type", "phone");
                  }}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                    values.type === "phone"
                      ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border-border text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiPhone size={18} />
                  <span>Phone Number</span>
                </button>
              </div>
              {errors.type && touched.type && (
                <p className="text-xs text-red-500 mt-1.5">{errors.type}</p>
              )}
            </div>

            {/* VALUE INPUT */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {values.type === "email" ? "Email Address" : "Phone Number"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative max-w-xl">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {values.type === "email" ? (
                    <FiMail size={18} />
                  ) : (
                    <FiPhone size={18} />
                  )}
                </div>
                <input
                  type={values.type === "email" ? "email" : "tel"}
                  name="value"
                  value={values.value}
                  onChange={handleChange}
                  placeholder={
                    values.type === "email"
                      ? "e.g. user@example.com"
                      : "e.g. 6158277764"
                  }
                  className={`w-full py-3.5 pl-11 pr-4 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.value && touched.value
                      ? "border-red-500 bg-red-50/20 focus:border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>
              {errors.value && touched.value && (
                <p className="text-xs text-red-500 mt-1.5">{errors.value}</p>
              )}
            </div>

            {/* STATUS SELECT */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="max-w-xs">
                <select
                  name="status"
                  value={values.status}
                  onChange={(e) =>
                    setFieldValue("status", Number(e.target.value))
                  }
                  className="w-full py-3 px-4 rounded-xl border border-border text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>
              {errors.status && touched.status && (
                <p className="text-xs text-red-500 mt-1.5">{errors.status}</p>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => router.push("/admin/blocklist")}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl border border-border text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="gradient-btn px-7 py-3 text-sm font-medium text-white rounded-xl cursor-pointer transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader />
                    <span>{isEdit ? "Updating..." : "Adding..."}</span>
                  </>
                ) : (
                  <span>
                    {isEdit ? "Update Blocklist" : "+ Add to Blocklist"}
                  </span>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
