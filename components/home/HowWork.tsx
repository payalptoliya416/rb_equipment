import Image from "next/image";

function HowWork() {
  const steps = [
    {
      title: "Browse Inventory",
      desc: "Explore our extensive collection of industrial machinery, farm tools, and equipment available for bidding.",
      icon: "/assets/icon5.svg",
    },
    {
      title: "Bid & Buy",
      desc: "Join live auctions or use the “Buy Now” option to secure high-quality equipment at competitive prices.",
      icon: "/assets/icon6.svg",
    },
    {
      title: "Track Order",
      desc: "Stay updated with real-time order tracking and delivery details until your purchased equipment safely arrives.",
      icon: "/assets/icon7.svg",
    },
  ];
  return (
    <section className="container-custom mx-auto my-20 lg:my-[110px]">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-[38px] md:leading-[38px] mb-[15px] font-bold text-gray mont-text">
          How It <span className="text-orange">Works</span>
        </h2>
        <p className="text-base leading-[16px] text-text-gray">
          Simple Steps to Buy or Bid
        </p>
      </div>
      <div className="grid grid-cols-12 lg:gap-10 ">
        {/* Left Image */}
        <div className="col-span-12 lg:col-span-6">
          <div className="block lg:hidden mb-6">
            <Image
              src="/assets/why3.png"
              alt="excavator"
              width={600}
              height={400}
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>

          <div className="hidden lg:block relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/assets/why3.png"
              alt="excavator"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-2 sm:gap-5 items-start relative pb-11 md:pb-[60px] last:pb-0 md:min-h-[120px] last:min-h-0"
            >
              {/* Icon + Line */}
              <div className="relative flex flex-col items-center shrink-0">
                {/* Icon Circle */}
                <div className="w-[55px] md:w-[70px] h-[55px] md:h-[70px] rounded-full bg-[#006d5b] flex items-center justify-center relative">
                  {/* Icon Wrapper */}
                  <div className="w-[28px] md:w-[32px] h-[28px] md:h-[32px] relative">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                {/* Dotted Line */}
              </div>
              {index !== steps.length - 1 && (
                <div className="absolute top-1/2 left-[28px] md:left-[35px] -translate-x-1/2 md:mt-1">
                  <Image
                    src="/assets/strechline.png"
                    alt="connector-line"
                    width={8}
                    height={50}
                    className="object-contain"
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#212121] mb-[10px]">
                  {step.title}
                </h3>
                <p className="text-[#646464] text-base leading-[26px]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWork;
