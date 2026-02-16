"use client";

import { clearAdminToken, getAdminUser } from "@/api/admin/adminAuth";
import { Menu } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineBars3, HiOutlineBellAlert } from "react-icons/hi2";
import { IoChevronDown } from "react-icons/io5";
import { FiChevronRight } from "react-icons/fi";

/* ================= TYPES ================= */
type AdminUser = {
  name: string;
  email: string;
};


/* ================= COMPONENT ================= */
export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
const pathname = usePathname();
const searchParams = useSearchParams();
const id = searchParams.get("id");
const segments = pathname
  .replace("/admin", "")
  .split("/")
  .filter(Boolean);

const showBreadcrumb = segments.length > 1;

const breadcrumb = showBreadcrumb
  ? segments
      .map(seg =>
        seg
          .replace(/-/g, " ")
          .replace(/\b\w/g, l => l.toUpperCase())
      )
      .join(" > ")
  : "";
  const handleBreadcrumbClick = (index: number) => {
  const path =
    "/admin/" + segments.slice(0, index + 1).join("/");

  router.push(path);
};

  const [user, setUser] = useState<AdminUser | null>(null);
const [open, setOpen] = useState(false);
const menuRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handler = (e: MouseEvent) => {
    if (!menuRef.current?.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, []);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  const handleLogout = () => {
    clearAdminToken();
    router.replace("/admin");
  };

  return (
    <header className="bg-white flex items-center justify-between border rounded-[14px] border-[#D3D3D3] p-3 sm:p-5 mb-5">
      {/* LEFT */}
    <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden border border-[#E9E9E9] rounded-md p-2"
        >
          <HiOutlineBars3 size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-semibold truncate whitespace-nowrap">
           {segments[0]
        ? segments[0]
            .replace(/-/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase())
        : "Dashboard"}
          </h1>
         {showBreadcrumb && (
            <p className="text-sm text-[#8C8C8C] block max-w-full truncate whitespace-nowrap">
        {segments.map((seg, idx) => {
          const label =
            seg === "add" && id
              ? "Update"
              : seg
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());

          return (
            <span key={idx} className="inline-flex items-center">
              {idx === 0 ? (
                <span
                  onClick={() => router.push("/admin/" + seg)}
                  className="cursor-pointer hover:text-[#0A7F71] font-medium"
                >
                  {label}
                </span>
              ) : (
                <span>{label}</span>
              )}

              {idx < segments.length - 1 && (
                <FiChevronRight className="mx-1 text-[#8C8C8C]" size={14} />
              )}
            </span>
          );
        })}
         </p>
        )}
        </div>
      </div>

      {/* RIGHT */}
    <div className="flex items-center gap-1 sm:gap-[15px] shrink-0">
        {/* Notification */}
        <button className="h-[42px] w-[42px] border border-[#E9E9E9] rounded-full flex items-center justify-center">
          <HiOutlineBellAlert size={20} className="text-[#4D4D4D]" />
        </button>

        {/* Profile */}
    <div className="relative" ref={menuRef}>
  <button
    onClick={() => setOpen((v) => !v)}
    className="bg-white rounded-full px-1 py-[4px]
    flex items-center gap-3 shadow-sm md:pe-3 cursor-pointer
    border border-[#E9E9E9]"
  >
    <Image
      src="/assets/user.png"
      width={36}
      height={36}
      alt="user"
      className="rounded-full"
    />

    <span className="text-[#4D4D4D] font-medium text-[16px] hidden md:block">
      {user?.name || "Admin"}
    </span>

    <IoChevronDown size={18} className="text-gray-600 hidden md:block" />
  </button>

  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -5 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-48 bg-white rounded-xl
        shadow-lg py-2 z-50 border border-gray-100"
      >
        <button
          onClick={() => {
            setOpen(false);
            router.push("/admin/settings");
          }}
          className="w-full text-left px-4 py-2 text-sm
          hover:bg-gray-100 cursor-pointer"
        >
          Settings
        </button>

        <div className="border-t my-1" />

        <button
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
          className="w-full text-left px-4 py-2 text-sm text-red-600
          hover:bg-red-50 cursor-pointer"
        >
          Logout
        </button>
      </motion.div>
    )}
  </AnimatePresence>
</div>

      </div>
    </header>
  );
}
