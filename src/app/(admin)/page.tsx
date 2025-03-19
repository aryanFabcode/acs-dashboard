'use client'
import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { useGetCarersQuery } from "@/lib/redux/api/carersApi";
import { useGetClientsQuery } from "@/lib/redux/api/clientApi";
import { useGetBookingsQuery } from "@/lib/redux/api/bookingsApi";

// export const metadata: Metadata = {
//   title:
//     "Dashboard | ACS",
//   description: "This is Home for ACS Dashboard",
// };

export default function Ecommerce() {
  const { data, isLoading } = useGetCarersQuery({});
  const { data: dataClients } = useGetClientsQuery({});
  const { data: bookings } = useGetBookingsQuery({all:true});

  console.log(bookings, 'what is the value in dataclients')

  const ecommerceMetrics = {
    totalCarers: data?.data?.totalCarer,
    totalClients: dataClients?.data?.totalClient,
    totalBookings: bookings?.data?.totalBooking
  }
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <EcommerceMetrics ecommerceMetrics={ecommerceMetrics} />

        <MonthlySalesChart bookings={bookings?.data?.bookings} />
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      {/* <div className="col-span-12">
        <StatisticsChart />
      </div> */}

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
    </div>
  );
}
