import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata = {
  title: "OASCMS Dashboard",
  description: "Overseas Apartment Sales & Contract Management System",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <AuthGuard>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    {children}
                  </main>
                </div>
              </div>
            </AuthGuard>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
