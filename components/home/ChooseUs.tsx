"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function ChooseUs() {
  return (
    <section className="bg-gray py-[60px]">
      <div className="container-custom mx-auto">
        
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-[38px] md:leading-[38px] font-bold text-white mont-text">
            Why <span className="text-orange">Choose Us</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] items-center md:items-stretch">

          {/* LEFT SIDE CARDS */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-[30px]"
          >
            {/* CARD COMPONENT */}
            {[
              { icon: "icon1.svg", title: "Verified Equipment" },
              { icon: "icon2.svg", title: "Trusted Sellers" },
              { icon: "icon3.svg", title: "Secure Payments" },
              { icon: "icon4.svg", title: "Fast Delivery" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: "easeOut" },
                  },
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 140, damping: 10 }}
                className="border border-text-gray rounded-lg p-5 cursor-pointer bg-gray/20 backdrop-blur-sm"
              >
                <Image
                  src={`/assets/${item.icon}`}
                  alt="icon"
                  width={40}
                  height={40}
                  className="mb-5"
                />
                <h3 className="text-light-gray text-xl leading-[20px] mb-[15px] font-semibold mont-text">
                  {item.title}
                </h3>
                <p className="text-base leading-[26px] font-normal text-light-gray">
                  Every listing is inspected and verified to ensure quality,
                  authenticity.
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* RIGHT SIDE IMAGE */}
          <motion.div
           initial={{ opacity: 0, y: 120 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: "easeOut" }}
  className="flex justify-center" 
          >
            <Image
              src="/assets/chooseus.png"
              alt="chooseus"
              width={550}
              height={454}
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ChooseUs;
