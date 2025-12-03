'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Building2, FileText, CreditCard, Ticket, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ locale }: { locale: string }) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();

  const navigation = [
    { name: t('dashboard'), href: `/${locale}`, icon: LayoutDashboard },
    { name: t('projects'), href: `/${locale}/projects`, icon: Building2 },
    { name: t('contracts'), href: `/${locale}/contracts`, icon: FileText },
    { name: t('payments'), href: `/${locale}/payments`, icon: CreditCard },
    { name: t('lottery'), href: `/${locale}/lottery`, icon: Ticket },
    { name: t('settings'), href: `/${locale}/settings`, icon: Settings },
  ];

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 rtl:border-l rtl:border-gray-800">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-xl font-bold text-white">OASCMS</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={clsx(
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
