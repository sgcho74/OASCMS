'use client';

import { Bell, User, Moon, Sun } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './auth/UserMenu';
import { useTranslations } from 'next-intl';
import { useThemeStore } from '@/store/useThemeStore';
import { useEffect, useState } from 'react';
import { useReservationStore } from '@/store/useReservationStore';
import { useContractStore } from '@/store/useContractStore';
import { formatDistanceToNow } from 'date-fns';

export default function Header() {
  const t = useTranslations('Common');
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-gray-900 border-gray-800 px-6 shadow-sm">
      <div className="flex items-center">
        <ActivityTicker />
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}

function ActivityTicker() {
  const { reservations } = useReservationStore();
  const { contracts } = useContractStore();
  const [latestActivity, setLatestActivity] = useState<{ text: string; time: Date; icon: any } | null>(null);

  useEffect(() => {
    const activities = [
      ...reservations.map((r) => ({
        date: new Date(r.reservationDate),
        text: `New reservation by ${r.customerName}`,
        icon: Bell,
      })),
      ...contracts.map((c) => ({
        date: new Date(c.createdAt),
        text: `Contract signed for Unit ${c.unitNumber}`,
        icon: Bell,
      })),
    ]
      .filter((a) => !isNaN(a.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    if (activities.length > 0) {
      setLatestActivity({
        text: activities[0].text,
        time: activities[0].date,
        icon: activities[0].icon,
      });
    }
  }, [reservations, contracts]);

  if (!latestActivity) {
    return (
      <div className="flex items-center text-gray-400">
        <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
        <span className="text-sm font-medium">System Operational</span>
      </div>
    );
  }

  return (
    <div className="flex items-center animate-fade-in">
      <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
        <Bell className="h-3.5 w-3.5" />
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-200">
          {latestActivity.text}
        </span>
        <span className="text-xs text-gray-500">
          {formatDistanceToNow(latestActivity.time, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
