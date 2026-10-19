"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { FiMail, FiPhone } from "react-icons/fi";
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
        <Form className="space-y-6 bg-white border border-border rounded-[14px] p-4 sm:p-6 w-full">
          {/* BLOCK TYPE */}
          <div>
            <label className="block mb-3 text-sm font-medium text-lightblack">
              Block Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => setFieldValue("type", "email")}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-[10px] border text-sm font-medium transition-all cursor-pointer ${
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
                onClick={() => setFieldValue("type", "phone")}
                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-[10px] border text-sm font-medium transition-all cursor-pointer ${
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
              <p className="text-xs text-red-500 mt-1">{errors.type}</p>
            )}
          </div>

          {/* SIDE-BY-SIDE: EMAIL/VALUE AND STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VALUE INPUT (EMAIL / PHONE) */}
            <div>
              <label className="block mb-3 text-sm font-medium text-lightblack">
                {values.type === "email" ? "Email Address" : "Phone Number"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
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
                  className={`w-full px-5 py-3.5 rounded-[10px] border text-sm focus:outline-none transition-colors ${
                    errors.value && touched.value
                      ? "border-red-500 bg-red-50/20 focus:border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>
              {errors.value && touched.value && (
                <p className="text-xs text-red-500 mt-1">{errors.value}</p>
              )}
            </div>

            {/* STATUS SELECT */}
            <div>
              <label className="block mb-3 text-sm font-medium text-lightblack">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={values.status}
                onChange={(e) =>
                  setFieldValue("status", Number(e.target.value))
                }
                className="w-full px-5 py-3.5 rounded-[10px] border border-border text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
              {errors.status && touched.status && (
                <p className="text-xs text-red-500 mt-1">{errors.status}</p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS (ALIGN RIGHT) */}
          <div className="flex justify-end items-center gap-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.push("/admin/blocklist")}
              disabled={isSubmitting}
              className="px-[18px] py-3 border rounded-[10px] text-seclightgray text-sm border-border cursor-pointer hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-[18px] py-3 rounded-[10px] text-white text-sm gradient-btn cursor-pointer transition-all hover:brightness-110 active:scale-95 ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isEdit ? "Updating..." : "Adding..."}</span>
                </span>
              ) : isEdit ? (
                "Update Blocklist"
              ) : (
                "Add Blocklist"
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
