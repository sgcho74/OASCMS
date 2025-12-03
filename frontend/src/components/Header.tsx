'use client';

import { Bell, User } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('Common');

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <h1 className="text-lg font-semibold text-gray-800">{t('dashboard')}</h1>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}
