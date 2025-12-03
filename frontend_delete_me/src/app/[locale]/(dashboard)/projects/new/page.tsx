'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  developer: z.string().min(1, 'Developer is required'),
  baseCurrency: z.string().min(3).max(3),
  projectTimezone: z.string().min(1),
  weekendConfig: z.string().min(1),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export default async function NewProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    console.log('New Project Data:', data);
    // TODO: Call API
    router.push(`/${locale}/projects`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Project Name</label>
            <div className="mt-2">
              <input
                type="text"
                {...register('projectName')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.projectName && <p className="text-red-500 text-xs mt-1">{errors.projectName.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">Country</label>
            <div className="mt-2">
              <input
                type="text"
                {...register('country')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">City</label>
            <div className="mt-2">
              <input
                type="text"
                {...register('city')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">Developer</label>
            <div className="mt-2">
              <input
                type="text"
                {...register('developer')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {errors.developer && <p className="text-red-500 text-xs mt-1">{errors.developer.message}</p>}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">Base Currency</label>
            <div className="mt-2">
              <select
                {...register('baseCurrency')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="KRW">KRW (South Korea)</option>
                <option value="USD">USD (United States)</option>
                <option value="IQD">IQD (Iraq)</option>
              </select>
            </div>
          </div>
          
           <div className="sm:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">Timezone</label>
            <div className="mt-2">
              <select
                {...register('projectTimezone')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="Asia/Seoul">Asia/Seoul</option>
                <option value="Asia/Baghdad">Asia/Baghdad</option>
              </select>
            </div>
          </div>

           <div className="sm:col-span-3">
            <label className="block text-sm font-medium leading-6 text-gray-900">Weekend Config</label>
            <div className="mt-2">
              <select
                {...register('weekendConfig')}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="Sat-Sun">Sat-Sun (Korea/Global)</option>
                <option value="Fri-Sat">Fri-Sat (Iraq/Middle East)</option>
              </select>
            </div>
          </div>

        </div>
        <div className="flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => router.back()}>
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
