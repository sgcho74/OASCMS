'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { LayoutDashboard, Building2, FileText, Ticket, Settings, CreditCard, Calendar, Users, Database, Map } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '@/store/useAuthStore';

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Common');
  const locale = useLocale();
  const { currentUser, hasPermission } = useAuthStore();

  const allNavigation = [
    { name: t('dashboard'), href: `/${locale}`, icon: LayoutDashboard, permission: null },
    { name: t('projects'), href: `/${locale}/projects`, icon: Building2, permission: 'projects:read' },
    { name: t('blocks'), href: `/${locale}/blocks`, icon: Building2, permission: 'projects:read' },
    { name: t('buildings'), href: `/${locale}/buildings`, icon: Building2, permission: 'projects:read' },
    { name: t('units'), href: `/${locale}/units`, icon: Building2, permission: 'units:read' },
    { name: t('birdseye'), href: `/${locale}/birdseye`, icon: Map, permission: null },
    { name: t('leads'), href: `/${locale}/leads`, icon: Users, permission: 'leads:read' },
    { name: t('reservations'), href: `/${locale}/reservations`, icon: Calendar, permission: 'reservations:read' },
    { name: t('contracts'), href: `/${locale}/contracts`, icon: FileText, permission: 'contracts:read' },
    { name: t('payments'), href: `/${locale}/payments`, icon: CreditCard, permission: 'payments:read' },
    { name: t('lottery'), href: `/${locale}/lottery`, icon: Ticket, permission: 'lottery:read' },
    { name: t('importExport'), href: `/${locale}/import-export`, icon: Database, permission: 'export:data' },
    { name: t('users'), href: `/${locale}/users`, icon: Users, permission: 'users:read' },
    { name: `🔧 ${t('migrate')}`, href: `/${locale}/migrate`, icon: Settings, permission: 'units:write' },
  ];

  // Filter navigation based on permissions
  const navigation = allNavigation.filter(item =>
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white border-r border-gray-800">
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wider text-white">
        OASCMS
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          // Check if active (handling trailing slashes or sub-paths)
          const isActive = pathname === item.href || (item.href !== `/${locale}` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="flex w-full items-center text-sm font-medium text-red-400 hover:text-red-300"
        >
          <Settings className="mr-3 h-5 w-5" />
          Reset Data
        </button>
      </div>
    </div>
  );
}
