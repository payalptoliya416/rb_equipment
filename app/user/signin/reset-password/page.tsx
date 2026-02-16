"use client";

import { JSX, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { resetPassword } from "@/api/services";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function ResetPassword(): JSX.Element {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("reset_email");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      toast.error("Email missing! Please restart reset process.");
      window.location.href = "/user/forgot-password";
    }
  }, []);

  const handleReset = async (values: any, { resetForm }: any) => {
    if (!email) return;

    try {
      const payload = {
        email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      };

      const res = await resetPassword(payload);

      toast.success(res?.message || "Password reset successful!");

      resetForm();

      setTimeout(() => {
        window.location.href = "/user/signin";
      }, 600);

    } catch (error) {
      // API wrapper handles errors
    }
  };

  return (
    <div className="container-custom mx-auto bg-[#F9F9F9] rounded-[14px] p-[20px] grid grid-cols-12 gap-5 min-h-[80vh] my-[60px]">
      
      {/* LEFT FORM CARD */}
      <div className="flex justify-center items-center col-span-12 lg:col-span-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full border border-light-gray rounded-[15px] py-[55px] px-5 sm:px-[30px] bg-white"
        >
          {/* Title */}
          <h2 className="text-[32px] font-bold text-center mb-[10px] mont-text">
            Reset <span className="text-orange">Password</span>
          </h2>

          <p className="text-center text-text-gray mb-[30px]">
            Create your new password to continue.
          </p>

          {/* FORM */}
          <Formik
            initialValues={{
              password: "",
              password_confirmation: "",
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleReset}
          >
            {() => (
              <Form className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="text-[#333333] font-medium mb-3 block text-lg mont-text">
                    New Password
                  </label>

                  <Field
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                    className="w-full mt-2 px-5 py-[14px] border border-light-gray rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                  />

                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-[#333333] font-medium mb-3 block text-lg mont-text">
                    Confirm Password
                  </label>

                  <Field
                    name="password_confirmation"
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full mt-2 px-5 py-[14px] border border-light-gray rounded-[10px] outline-none focus:ring-2 focus:ring-green"
                  />

                  <ErrorMessage
                    name="password_confirmation"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green text-white py-[14px] rounded-lg text-lg font-semibold hover:opacity-90 transition  cursor-pointer"
                >
                  Reset Password →
                </button>
              </Form>
            )}
          </Formik>

          <p className="text-center mt-[25px] text-lg font-semibold mont-text">
            <Link href="/user/signin" className="text-green">
              ← Back to Signin
            </Link>
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL IMAGE */}
     <div 
            className="
              relative 
              col-span-12 lg:col-span-6 
              w-full h-[300px] lg:h-full 
              rounded-2xl overflow-hidden shadow-md
              bg-cover bg-center
            "
            style={{ backgroundImage: "url('/assets/user-bg.png')" }}
          >

            {/* DARK OVERLAY (Improves readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* TEXT BLOCK */}
            <div className="absolute bottom-4 left-4 right-4 lg:bottom-10 lg:left-10 lg:right-10 text-white">

              <h2 className="text-2xl lg:text-[32px] font-bold leading-snug lg:leading-[48px] mb-[10px] mont-text">
                Manage Your Equipment Deals with Confidence
              </h2>

              <p className="text-base lg:text-lg leading-[22px] lg:leading-[26px]">
                Track bids, purchases, and deliveries – all from one simple dashboard.
              </p>

            </div>

          </div>
    </div>
  );
}
