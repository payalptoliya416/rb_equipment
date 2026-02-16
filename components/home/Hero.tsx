"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";

function Hero() {
  const { companyName } = useSettings();

  return (
    <section className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="-mt-32 absolute top-0 left-0 w-full h-full lg:h-[700px] bg-[url(/assets/main-bg.png)] bg-no-repeat bg-top -z-10  bg-cover lg:bg-[length:100%_100%]"
      ></motion.div>
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-12 pt-10 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="col-span-12 lg:col-span-6"
          >
            <h4 className="text-gray text-lg xl:text-xl font-semibold mb-4 xl:mb-6 relative after:absolute after:top-3 after:left-0 after:bg-gray after:w-[15px] after:h-[2px] pl-5 after:rounded-full mont-text">
              Welcome to {companyName.toUpperCase()}
            </h4>
            <h2 className="text-2xl sm:text-4xl xl:text-[50px] font-bold text-gray  sm:leading-[52px] xl:leading-[68px] mb-5 mont-text">
              Reliable <span className="text-orange">Industrial</span> &{" "}
              <span className="text-orange">Farm Equipment</span> Sales &
              Auctions
            </h2>
            <p className="text-para text-base font-normal mb-8 leading-[26px]">
              Buy or Bid on high-quality machinery, tractors, and tools from
              trusted sellers. Whether you're expanding your fleet or upgrading
              your equipment, {companyName} has you covered.
            </p>
            <div className="flex items-center gap-4">

              {/* Buy Now */}
              <Link
                href="/inventory"
                className="group relative overflow-hidden py-3 px-6 text-white bg-green rounded-lg mont-text transition-all duration-300 font-semibold"
              >
                <span className="relative z-10">Buy Now</span>

                {/* Sliding overlay effect */}
                <span
                  className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                 group-hover:translate-x-[100%] transition-all duration-500"
                ></span>
              </Link>

              {/* Bid Now */}
              <Link
                href="/inventory"
                className="group relative overflow-hidden py-3 px-6 text-green border border-green rounded-lg mont-text transition-all duration-300 font-semibold"
              >
                <span className="relative z-10">Bid Now</span>

                {/* Sliding overlay effect */}
                <span
                  className="absolute inset-0 bg-green/20 translate-x-[-100%] 
                 group-hover:translate-x-[100%] transition-all duration-500"
                ></span>
              </Link>

            </div>

          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="col-span-12 lg:col-span-6 mt-10 2xl:mt-8  hero-img-margin"
          >
            <Image
              src="/assets/zasi1.png"
              alt="Hero"
              width={749}
              height={609}
              loading="eager"
              priority
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
