import { SubmitButton } from './submit-button';
import { signIn } from './actions';
import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/utils/mock-data';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Inicia sesión en OpenCalisthenics para acceder a tus entrenamientos personalizados',
};

export default async function Login() {
  const t = await getTranslations('Auth');

  // Check if user is already logged in
  const supabase = await createClient();

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      redirect('/');
    }
  }

  const authDisabled = !isSupabaseConfigured();

  if (authDisabled) {
    return (
      <div className="mx-auto max-w-md w-full py-8">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{t('demoMode.title')}</h1>
            <p className="text-gray-500 mb-6">
              {t('demoMode.message')}
            </p>
            <Link
              href="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors"
            >
              {t('demoMode.backHome')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md w-full py-8">
      <div className="bg-surface rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t('login.title')}</h1>
          <p className="text-gray-500 mt-2">
            {t('login.description')}
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t('login.emailLabel')}
            </label>
            <input
              className="w-full rounded-md px-4 py-2 bg-inherit border focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
              name="email"
              type="email"
              placeholder={t('login.emailPlaceholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              {t('login.passwordLabel')}
            </label>
            <input
              className="w-full rounded-md px-4 py-2 bg-inherit border focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <SubmitButton
            formAction={signIn}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors mt-4"
            pendingText={t('login.signingIn')}
          >
            {t('login.signIn')}
          </SubmitButton>

          <div className="text-center mt-4">
            <p className="text-sm">
              {t('login.noAccount')}{' '}
              <Link href="/register" className="text-purple-500 hover:text-purple-700 font-medium">
                {t('login.signUp')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
