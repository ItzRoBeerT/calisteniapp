import { SubmitButton } from '../login/submit-button';
import { signUp } from '../login/actions';
import { Link } from '@/i18n/navigation';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/utils/mock-data';

export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crea una nueva cuenta en Calisteniapp para acceder a entrenamientos personalizados',
};

export default async function Register() {
  const t = await getTranslations('Auth');

  const supabase = await createClient();

  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      redirect('/');
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-md w-full py-8">
        <div className="bg-surface rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">{t('register.title', 'Crear Cuenta')}</h1>
            <p className="text-gray-500 mb-6">
              El registro no está disponible en este momento. La aplicación está funcionando en modo demo.
            </p>
            <Link
              href="/"
              className="inline-block bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors"
            >
              Volver al inicio
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
          <h1 className="text-3xl font-bold">{t('register.title', 'Crear Cuenta')}</h1>
          <p className="text-gray-500 mt-2">
            {t('register.description', 'Únete a nuestra comunidad de calistenia')}
          </p>
        </div>
        
        <form className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              {t('register.emailLabel', 'Email')}
            </label>
            <input
              className="w-full rounded-md px-4 py-2 bg-inherit border focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
              name="email"
              type="email"
              placeholder={t('register.emailPlaceholder', 'tu@email.com')}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              {t('register.passwordLabel', 'Contraseña')}
            </label>
            <input
              className="w-full rounded-md px-4 py-2 bg-inherit border focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('register.passwordHint', 'La contraseña debe tener al menos 6 caracteres')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
              {t('register.confirmPasswordLabel', 'Confirmar Contraseña')}
            </label>
            <input
              className="w-full rounded-md px-4 py-2 bg-inherit border focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>
          
          <SubmitButton
            formAction={signUp}
            className="w-full bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors mt-4"
            pendingText={t('register.signingUp', 'Creando cuenta...')}
          >
            {t('register.createAccount', 'Crear Cuenta')}
          </SubmitButton>
          
          <div className="text-center mt-4">
            <p className="text-sm">
              {t('register.haveAccount', '¿Ya tienes una cuenta?')}{' '}
              <Link href="/login" className="text-purple-500 hover:text-purple-700 font-medium">
                {t('register.signIn', 'Iniciar Sesión')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}