"use client";

import { useSettings } from "@/contexts/SettingsContext";
import Link from "next/link";

function UserFooter() {
  const { companyName, settings } = useSettings();
  return (
    <div className="bg-gray ">
      <div className="py-12 container-custom mx-auto grid grid-cols-12 gap-4 lg:gap-5 sm:gap-1 items-center">
        <div className="text-center md:text-left col-span-12 xl:col-span-8">
          <p className="text-light-gray text-base font-normal text-center lg:text-left mb-3 lg:mb-0">
            <Link
              href="/"
              className="text-orange font-semibold"
            >
              {companyName || settings?.company_name || "Capital Equipment Auctions"}
            </Link>{" "}
            is owned by {companyName ? (companyName.toUpperCase().includes("LLC") ? companyName.toUpperCase() : `${companyName.toUpperCase()}, LLC`) : "CAPITAL EQUIPMENT AUCTIONS, LLC"} Reg nº : (201702410607) -
            Copyright {new Date().getFullYear()} © All Rights Reserved
          </p>
        </div>
        <div className="text-center md:text-left col-span-12 xl:col-span-4 flex items-center justify-center xl:justify-end gap-5 flex-col lg:flex-row">
          <div className="flex justify-center items-center">
            <Link
              href="/terms-condition"
              className="text-light-gray text-base leading-[16px] font-normal"
            >
              Terms & services
            </Link>

            <span className="mx-3 text-light-gray">|</span>

            <Link
              href="/privacy-policy"
              className="text-light-gray text-base leading-[16px] font-normal"
            >
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserFooter;
