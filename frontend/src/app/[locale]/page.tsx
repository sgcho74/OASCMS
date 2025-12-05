'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import InventoryDistributionChart from '@/components/dashboard/InventoryDistributionChart';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import CustomerPortal from '@/components/customer/CustomerPortal';

export default function DashboardPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { currentUser, hasRole } = useAuthStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  // Show Customer Portal for customer role
  if (hasRole('customer')) {
    return <CustomerPortal />;
  }

  // Show Executive Dashboard for all other roles
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Executive Dashboard</h1>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <div>
          <InventoryDistributionChart />
        </div>
      </div>

      <RecentActivityList />
    </div>
  );
}
