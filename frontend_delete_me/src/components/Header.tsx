'use client';

import LanguageSwitcher from './LanguageSwitcher';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1" />
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
          <LanguageSwitcher />
          <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
          <div className="flex items-center gap-x-4 lg:gap-x-6">
             {/* Profile dropdown placeholder */}
             <span className="text-sm font-semibold leading-6 text-gray-900">Admin User</span>
          </div>
        </div>
      </div>
    </div>
  );
}
