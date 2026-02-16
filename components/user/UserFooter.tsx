'use client'

import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { motion } from "framer-motion";

function UserFooter() {
  return (
    <div className="bg-gray ">
    <div className="py-12 container-custom mx-auto grid grid-cols-12 gap-5 sm:gap-1 items-center">
       <div className="text-center md:text-left col-span-12 md:col-span-4">
        <p  className="text-light-gray text-base font-normal">Copyright 2026 © All Right Reserved</p>
       </div>
       <div className="text-center md:text-left col-span-12 md:col-span-4">
       <Link href='/terms-condition' className="text-light-gray text-base leading-[16px] font-normal">Terms & services </Link>
       <Link href='/'  className="text-light-gray text-base leading-[16px] font-normal ms-3">Privacy policy</Link>
       </div>
       <div className="text-center md:text-left col-span-12 md:col-span-4">
   <div className="flex justify-center md:justify-end gap-[15px]">
  {[
    { icon: <FaFacebookF size={16} />, link: "https://facebook.com/" },
    { icon: <FaXTwitter size={16} />, link: "https://twitter.com/" },
    { icon: <FaInstagram size={16} />, link: "https://instagram.com/" },
    { icon: <FaLinkedinIn size={16} />, link: "https://linkedin.com/" }
  ].map((item, i) => (
    <a
      key={i}
      href={item.link}
      target="_blank"
      className="group"
    >
      <motion.div
        whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-[32px] h-[32px] flex justify-center items-center rounded-full 
                  border border-white/10 text-white cursor-pointer"
      >
        {item.icon}
      </motion.div>
    </a>
  ))}
</div>

       </div>
    </div>
    </div>
  )
}

export default UserFooter
