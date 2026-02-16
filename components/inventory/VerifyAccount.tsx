"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  uploadLicense,
  uploadLicenseData,
} from "@/api/user/license";
import { getUserProfile, UserProfile } from "@/api/user/profile";
import { useEffect } from "react";
import { getCountryFromAddress } from "@/api/geoapify";
import { UploadBox } from "./UploadBox";
import { useRouter, useSearchParams } from "next/navigation";
const REQUIRES_BACK = true;

export default function VerifyAccount() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
const router = useRouter();
const searchParams = useSearchParams();
const returnUrl = searchParams.get("returnUrl") || "/";

  // useEffect(() => {
  //   getUserProfile().then((res) => {
  //     if (res.status) setProfile(res.data);
  //   });
  // }, []);

  const requiresBack = REQUIRES_BACK;
  const [country, setCountry] = useState<string | null>(null);

 useEffect(() => {
  const loadProfileAndCountry = async () => {
    const res = await getUserProfile();
    if (!res.status) return;

    setProfile(res.data);

    try {
      const geo = await getCountryFromAddress(
        res.data.address,
        res.data.city,
        res.data.state,
        res.data.zip_code,
      );

      if (!geo?.country_code) {
        setCountry("USA");
        return;
      }

      setCountry(geo.country_code);
    } catch (err) {
      setCountry("USA");
    }
  };

  loadProfileAndCountry();
}, []);

  const submitLicenseToNewAPI = async () => {
    if (!frontFile) return;

    const fd = new FormData();
    fd.append("front_side", frontFile);

    if (requiresBack && backFile) {
      fd.append("back_side", backFile);
    }

    try {
      const res = await uploadLicenseData(fd);
      if (!res?.status) {
        console.error("New API upload failed:", res);
        return;
      }
    } catch (err) {
      console.error("New API error:", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!frontFile) {
      toast.error("Please upload document");
      return;
    }

    if (requiresBack && !backFile) {
      toast.error("Back side is required for this document");
      return;
    }

    if (!profile?.email) {
      toast.error("User profile not found. Please log in.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("front", frontFile);

      if (requiresBack && backFile) {
        formData.append("back", backFile);
      }

     formData.append("docType", "DRIVERS");
      if (country) {
        formData.append("country", country);
      }
      const res = await uploadLicense(formData);

      if (!res.status) {
        toast.error(res.message || "Upload failed");
        return;
      }

      toast.success("License uploaded successfully");
      submitLicenseToNewAPI();
      setFrontFile(null);
      setBackFile(null);
      
    setTimeout(() => {
      router.replace(returnUrl);
    }, 800);
     
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-[110px] flex justify-center px-4">
      <div className="border rounded-[15px] p-[30px] max-w-[650px] w-full border-light-gray">
        <h3 className="text-3xl text-center mb-6 font-semibold">
          Verify your <span className="text-orange">account</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UploadBox
              label="Upload Front Side"
              file={frontFile}
              onChange={setFrontFile}
            />

            {requiresBack && (
              <UploadBox
                label="Upload Back Side"
                file={backFile}
                onChange={setBackFile}
              />
            )}
          </div>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={uploading || !frontFile || (requiresBack && !backFile)}
              className={`px-6 py-3 rounded-lg text-white ${
                uploading || !frontFile || (requiresBack && !backFile)
                  ? "bg-gray-400"
                  : "bg-green  cursor-pointer "
              }`}
            >
              {uploading ? "Uploading..." : "Submit"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
