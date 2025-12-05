'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState(locale);

  // Sync with URL changes
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    setCurrentLocale(newLocale);

    // Replace the locale segment in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <select
        value={currentLocale}
        onChange={handleChange}
        className="block rounded-md border-gray-600 bg-gray-700 py-1 pl-2 pr-8 text-sm text-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
      >
        <option value="en">English</option>
        <option value="ko">한국어</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
