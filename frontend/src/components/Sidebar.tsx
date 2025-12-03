'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { LayoutDashboard, Building2, FileText, Ticket, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Common');
  const locale = useLocale();

  const navigation = [
    { name: t('dashboard'), href: `/${locale}`, icon: LayoutDashboard },
    { name: t('projects'), href: `/${locale}/projects`, icon: Building2 },
    { name: t('contracts'), href: `/${locale}/contracts`, icon: FileText },
    { name: t('lottery'), href: `/${locale}/lottery`, icon: Ticket },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6 font-bold text-xl tracking-wider">
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
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
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
