'use client'

import { DashboardCard, getUserDashboard, RecentBid, RecentBuyOrder, RecentBuyOrderData } from "@/api/user/dashboard";
import Image from "next/image"
import { useEffect, useState } from "react";

function Dashboard() {
const [cards, setCards] = useState<DashboardCard[]>([]);
const [recentBids, setRecentBids] = useState<RecentBid[]>([]);
const [recentOrders, setRecentOrders] = useState<RecentBuyOrderData[]>([]);

const fetchDashboard = async () => {
  try {
    const res = await getUserDashboard();

    if (!res.success) return;

    const data = res.data;

    setCards([
      {
        id: 1,
        icon: "/assets/dash1.svg",
        bg: "#F98686",
        count: data.total_bids_placed,
        label: "Total Bids Placed",
      },
      {
        id: 2,
        icon: "/assets/dash2.svg",
        bg: "#78DBFF",
        count: data.active_bids,
        label: "Active Bids",
      },
      {
        id: 3,
        icon: "/assets/dash3.svg",
        bg: "#A790F9",
        count: data.items_won,
        label: "Items Won",
      },
      {
        id: 4,
        icon: "/assets/dash4.svg",
        bg: "#FC8AD6",
        count: data.items_purchased,
        label: "Items Purchased",
      },
    ]);
    setRecentBids(data.recent_bids);
    setRecentOrders(data.recent_buy_orders);

  } catch (error) {
    console.error("Dashboard API error:", error);
  }
};


useEffect(() => {
  fetchDashboard();
}, []);

  return (
    <section className="py-[25px]">
      <div className="container-custom mx-auto">
        <h1 className="text-[#373737] text-[22px] sm:text-[26px] font-bold mb-[15px]">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {cards.map((item) => (
            <div
              key={item.id}
              className="border rounded-[10px] border-[#E9E9E9] p-[20px] sm:p-[25px] flex flex-col gap-[15px]"
            >
              <div
                className="w-[60px] h-[60px] rounded-[18px] p-[15px] flex justify-center items-center"
                style={{ backgroundColor: item.bg }}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={30}
                  height={30}
                />
              </div>

              <h3 className="text-gray text-[30px] sm:text-[38px] font-bold">
                {item.count}
              </h3>

              <p className="text-[#909090] text-[18px] sm:text-[22px] leading-[22px]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      <div className="grid  grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="p-[15px] border border-[#E9E9E9] rounded-[10px]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold">Recent Bidding</h2>
                <button className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                  View All
                </button>
              </div>
                 <div className="grid grid-cols-12"> 
                     <div className="col-span-12">
                         <div className="w-full overflow-x-auto border border-[#E9E9E9] rounded-[10px]">
                            <table className="border-collapse min-w-full">
                            <thead>
                                <tr className="bg-[#F2F8F7] text-left">
                                <th className="px-[15px] py-[18px] text-sm font-medium text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
                                    Machinery
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
                                    Last Bid
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-[#373737] whitespace-nowrap">
                                    Bid End Date
                                </th>
                                </tr>
                            </thead>
    
                         <tbody>
  {recentBids.length > 0 ? (
    recentBids.map((bid, index) => (
      <tr
        key={index}
        className="border-t border-[#E9E9E9] even:bg-[#F9F9F9]"
      >
        <td className="px-[15px] py-[18px] text-sm text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
          {bid.machinery_name}
        </td>

        <td className="px-[15px] py-[18px] text-sm text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
          ${bid.bid_amount}
        </td>

        <td className="px-[15px] py-[18px] text-sm text-[#373737] whitespace-nowrap">
          <span className="bg-[#E9E9E9] px-3 py-1 rounded-[4px] text-[13px]">
            {new Date(bid.bid_end_time).toLocaleDateString()}
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={3} className="text-center py-4 text-gray-400">
        No Recent Bids Found
      </td>
    </tr>
  )}
</tbody>

                            </table>
                         </div>
                     </div>
                 </div>
            </div>
    
            <div className="p-[15px] border border-[#E9E9E9] rounded-[10px]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold">Recent Buy Orders</h2>
                <button className="relative overflow-hidden gradient-btn px-[14px] py-2 text-sm text-white rounded-md transition-all duration-200 ease-in-out hover:brightness-110 hover:shadow-md
                  active:brightness-90 active:scale-95">
                  View All
                </button>
              </div>
            <div className="grid grid-cols-12"> 
                  <div className="col-span-12">
                     <div className="w-full overflow-x-auto border border-[#E9E9E9] rounded-[10px]">
                            <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#F2F8F7] text-left">
                                <th className="px-[15px] py-[18px] text-sm font-medium text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
                                    Machinery Name
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
                                    Won User Name
                                </th>
                                <th className="px-[15px] py-[18px] text-sm font-medium text-[#373737] whitespace-nowrap">
                                    Won Bid Price
                                </th>
                                </tr>
                            </thead>
    
                          <tbody>
                              {recentOrders.length > 0 ? (
                                recentOrders.map((order, index) => (
                                  <tr
                                    key={index}
                                    className="border-t border-[#E9E9E9] even:bg-[#F9F9F9]"
                                  >
                                    <td className="px-[15px] py-[18px] text-sm text-[#373737] border-r border-[#E9E9E9] whitespace-nowrap">
                                      {order.machinery_name}
                                    </td>

                                    <td className="px-[15px] py-[18px] text-sm border-r border-[#E9E9E9] whitespace-nowrap">
                                      <span
                                        className={`px-3 py-1 rounded-[4px] text-white text-[13px]
                                          ${
                                            order.status === "Delivered"
                                              ? "bg-[#2DBE60]"
                                              : "bg-[#E53935]"
                                          }
                                        `}
                                      >
                                        {order.status}
                                      </span>
                                    </td>

                                    <td className="px-[15px] py-[18px] text-sm text-[#373737] whitespace-nowrap">
                                      ${order.amount}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={3} className="text-center py-4 text-gray-400">
                                    No Recent Orders Found
                                  </td>
                                </tr>
                              )}
                            </tbody>


                            </table>
                     </div>
                  </div>
            </div>
            </div>
          </div>
      </div>
    </section>
  )
}

export default Dashboard
