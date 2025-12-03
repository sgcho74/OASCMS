import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Dashboard');

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Stats Cards */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">{t('totalProjects')}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
        <span className="text-sm text-green-600">+2 this month</span>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">{t('activeContracts')}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">85</p>
        <span className="text-sm text-green-600">+12% from last month</span>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">{t('totalRevenue')}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">$4.2M</p>
        <span className="text-sm text-green-600">+8% vs target</span>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">{t('lotteryApplicants')}</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">1,240</p>
        <span className="text-sm text-blue-600">{t('activeRound')} #4</span>
      </div>
    </div>
  );
}
