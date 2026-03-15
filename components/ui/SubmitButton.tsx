'use client';

import { useFormStatus } from 'react-dom';
import { type ComponentProps, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/stores/toast';

type Props = Omit<ComponentProps<'button'>, 'formAction'> & {
  pendingText?: string;
  formAction?: (formData: FormData) => Promise<{ error?: string; success?: string | boolean; redirect?: string }>;
};

export function SubmitButton({ children, pendingText, formAction, ...props }: Props) {
  const { pending } = useFormStatus();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);

  const isPending = pending;

  const handleClick = async () => {
    setErrorMessage(null);
  };

  const wrappedAction = async (fd: FormData) => {
    if (!formAction) return;
    try {
      setErrorMessage(null);

      const result = await formAction(fd);

      if (result?.error) {
        setErrorMessage(result.error);
        addToast(result.error, 'error');
        return;
      }

      if (typeof result?.success === 'string') {
        addToast(result.success, 'success');
      }

      if (result?.redirect) {
        setErrorMessage(null);
        router.push(result.redirect);
        router.refresh();
        return;
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error &&
          typeof (error as { digest?: string }).digest === 'string' &&
          (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      const unexpectedError = 'An unexpected error occurred';
      setErrorMessage(unexpectedError);
      addToast(unexpectedError, 'error');
      console.error('Form submission error:', error);
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      <button
        {...props}
        type="submit"
        aria-disabled={isPending}
        formAction={wrappedAction as unknown as (formData: FormData) => void | Promise<void>}
        onClick={handleClick}
      >
        {isPending ? pendingText : children}
      </button>
    </>
  );
}
