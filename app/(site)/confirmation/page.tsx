"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFileSignature } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { MdError, MdLocalShipping } from "react-icons/md";
import { BsFillInfoCircleFill, BsFillPatchCheckFill } from "react-icons/bs";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Category } from "@/api/data";
import { SingleMachinery } from "@/types/apiType";
import {
  getAllCategories,
  getMakes,
  getModels,
  getSingleInventory,
} from "@/api/categoryActions";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";
import { getUserDetails, UserDetails } from "@/api/user/profile";

type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

type Step = {
  title: string;
  desc:
    | string
    | React.ReactNode
    | ((value: string | Address) => React.ReactNode);
  icon: any;
};

const steps: Step[] = [
  {
    title: "Confirm your order",
    desc: `Once we check your request, you'll receive a link to review and confirm all your order details before electronically signing the order confirmation.`,
    icon: FaFileSignature,
  },
  {
    title: "Pay Pro-Forma Invoice",
    desc: (email: string | Address) => (
      <>
        Once your order is confirmed, we will send the Pro-Forma Invoice to{" "}
        <span className="font-bold text-green break-words break-all">
          {typeof email === "string" ? email : "your email"}
        </span>
      </>
    ),
    icon: FaFileInvoiceDollar,
  },
  {
    title: "Receive your equipment",
    desc: (address: string | Address) => {
      if (typeof address === "string") return null;

      const parts = [
        address.street,
        address.city,
        address.state,
        address.zip,
        address.country,
      ].filter(Boolean);

      return (
        <>
          We'll keep you posted on when your equipment will get delivered to{" "}
          <span className="font-bold text-green break-words">
            {parts.join(", ")}
          </span>
          .
        </>
      );
    },
    icon: MdLocalShipping,
  },
  {
    title: "Test drive your purchase",
    desc: (
      <>
        Test your equipment for 5 days or 25 engine hours. Not satisfied? Our
        Money Back Guarantee covers a full refund of your purchase.{" "}
        <Link
          href="/terms-condition"
          className="text-green font-semibold underline hover:text-black transition"
        >
          Buyer Terms & Conditions
        </Link>
        .
      </>
    ),
    icon: BsFillPatchCheckFill,
  },
];

function ConfirmationPage() {
 
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const categorySlug = segments[1] ?? "";
  const makeSlug = segments[2] ?? "";
  const modelSlug = segments[3] ?? "";
  const auction_id = segments[4] ?? "";
  const [pageLoading, setPageLoading] = useState(true);
const [userData, setUserData] = useState<UserDetails | null>(null);
const [userLoading, setUserLoading] = useState(true);

useEffect(() => {
  const fetchUserDetails = async () => {
    try {
      setUserLoading(true);

      const res = await getUserDetails();

      if (res.status) {
        setUserData(res.data);
      } else {
        toast.error(res.message || "Failed to fetch user details");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching user details");
    } finally {
      setUserLoading(false);
    }
  };

  fetchUserDetails();
}, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const [categories, setCategories] = useState<Category[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const [product, setProduct] = useState<SingleMachinery | null>(null);

useEffect(() => {
  if (product) {
    window.scrollTo(0, 0);
  }
}, [product]);

const getFirstValidImage = (images?: { full_url?: string }[]) => {
  if (!images || images.length === 0) return null;

  return images.find((img) => img?.full_url)?.full_url || null;
};
const imageUrl = getFirstValidImage(product?.images);

  useEffect(() => {
    const loadData = async () => {
      setPageLoading(true);
      try {
        const catRes = await getAllCategories();
        if (catRes?.success) setCategories(catRes.data);

        const makeRes = await getMakes();
        if (makeRes?.success) setMakes(makeRes.data);

        const modelRes = await getModels();
        if (modelRes?.success) setModels(modelRes.data);
      } catch (err) {
        toast.error("Failed to load dropdown data");
      }
    };

    loadData();
  }, []);

  const matchedCategory = categories.find(
    (c) => slugify(c.category_name) === categorySlug,
  );

  const matchedMake = makes.find((m) => slugify(m) === makeSlug);
  const matchedModel = models.find((m) => slugify(m) === modelSlug);

  useEffect(() => {
    if (!matchedCategory || !matchedMake || !matchedModel || !auction_id) return;

    const fetchProduct = async () => {
      setPageLoading(true);

      try {
        const res = await getSingleInventory({
          category: matchedCategory.category_name,
          make: matchedMake,
          model: matchedModel,
          auction_id: auction_id,
        });

        if (res?.success) {
          setProduct(res.data);
        }
      } catch (err: any) {
        toast.error(err?.message || "Product fetch failed");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [matchedCategory, matchedMake, matchedModel, auction_id]);

if (pageLoading || userLoading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
      <Loader />
    </div>
  );
}
  return (
    <>
      <section className="pt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-light-gray rounded-xl p-4 sm:p-6">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
              Congratulations!
            </h1>

            {/* Message */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              You have submitted a request to purchase with our pre-approved{" "}
              <span className="font-medium">"Buy-Now Price"</span>. You have the
              highest priority over other buyers and no negotiation with the
              seller is necessary. We will now review your request, the
              automatic transport budget and your company information.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {/* Button 1 */}
              <Link
                href="/user/orders"
                className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
              >
                View Buy-Now Request
              </Link>

              {/* Button 2 */}
              <Link
                href="/inventory"
                className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition text-center"
              >
                View Listing
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border border-light-gray rounded-xl p-2 md:p-6">
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
                    <div className="w-[28px] md:w-[32px] h-[28px] md:h-[32px] flex items-center justify-center">
                      {(() => {
                        const Icon = step.icon;
                        return <Icon size={28} className="text-white" />;
                      })()}
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

                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-[#212121] mb-2">
                    {step.title}
                  </h3>

              <p className="text-[#646464] text-base leading-[26px] mb-4">
                    {typeof step.desc === "function"
                      ? step.title === "Pay Pro-Forma Invoice"
                        ? step.desc(userData?.email || "your email")
                        : step.title === "Receive your equipment"
                        ? step.desc({
                            street: userData?.address,
                            city: userData?.city,
                            state: userData?.state,
                            zip: userData?.zip_code,
                            country: "USA",
                          })
                        : null
                      : step.desc}
                  </p>


                  {step.title === "Receive your equipment" && (
                    <>
                      {product && (
                        <div className="bg-white border border-light-gray rounded-xl p-4 sm:p-6">
                          <h2 className="text-lg font-semibold text-gray-800 mb-5">
                            Buy-Now Request
                          </h2>

                          <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Image */}
                            <div className="w-full md:w-[300px] flex-shrink-0">
                              <div className="w-full">
                                <div className="w-full md:w-[280px] flex-shrink-0">
                                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-xl overflow-hidden">
                                 {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={product.name}
                                    fill
                                    className="sm:object-cover object-contain"
                                    priority
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                                    No Image Available
                                  </div>
                                )}
                                </div>
                              </div>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 space-y-2 w-full">
                              {/* Category + Badge */}
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <p className="text-gray-500 text-sm">
                                  {product.category?.category_name}
                                </p>

                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                  <TbRosetteDiscountCheckFilled size={18} />
                                  Inspected
                                </span>
                              </div>

                              <h3 className="font-bold text-gray-900 text-lg">
                                {product.name}
                              </h3>

                              <p className="text-gray-500 text-sm">
                                {product.year} • {product.weight} lbs •{" "}
                                {product.working_hours} hrs
                              </p>

                              <p className="text-sm text-gray-600">
                                <strong>Auction ID:</strong>{" "}
                                {product.auction_id}
                              </p>

                              <p className="text-green-600 font-bold text-lg mt-2">
                                Buy Now: ${product.buy_now_price}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ConfirmationPage;
