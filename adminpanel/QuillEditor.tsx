"use client";

import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useFormikContext } from "formik";

interface Props {
  name: string;
}

export default function QuillEditor({ name }: Props) {
  const { values, setFieldValue, errors, touched } =
    useFormikContext<any>();

  const { quill, quillRef } = useQuill({
    theme: "snow",
    placeholder: "Enter description here...",
  });

  // ✅ Sync Quill → Formik
  useEffect(() => {
    if (!quill) return;

    // Load initial value once
    if (values[name]) {
      quill.root.innerHTML = values[name];
    }

    // Update Formik when user types
    quill.on("text-change", () => {
      setFieldValue(name, quill.root.innerHTML);
    });
  }, [quill]);

  // ✅ Safe error message
  const errorMsg =
    touched[name] && typeof errors[name] === "string"
      ? errors[name]
      : "";

  return (
    <div className="w-full">
      {/* Editor Wrapper */}
      <div
        className={`rounded-xl overflow-hidden border transition ${
          errorMsg
            ? "border-red-500"
            : "border-[#e9e9e9]"
        }`}
      >
        {/* Quill Editor */}
        <div ref={quillRef} className="bg-white"  />
      </div>

      {/* Error Message */}
      {errorMsg && (
        <p className="text-red-500 text-xs mt-2">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
