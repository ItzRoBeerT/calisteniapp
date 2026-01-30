'use client';

import { useFormStatus } from 'react-dom';
import { type ComponentProps, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = ComponentProps<'button'> & {
  pendingText?: string;
};

export function SubmitButton({ children, pendingText, ...props }: Props) {
  const { pending, action } = useFormStatus();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  
  const isPending = pending && action === props.formAction;

  const handleClick = async () => {
    // Clear previous error messages
    setErrorMessage(null);
  };

  // Modify the formAction to handle errors
  const wrappedAction = async (formData: FormData) => {
    try {
      setErrorMessage(null);
      
      const result = await (props.formAction as unknown as (formData: FormData) => Promise<{error?: string; success?: boolean; redirect?: string}>)(formData);
      
      // Handle errors or success messages
      if (result?.error) {
        setErrorMessage(result.error);
        return;
      }
      
      // Handle success with redirect
      if (result?.success && result?.redirect) {
        setErrorMessage(null);
        setTimeout(() => {
          router.push(result.redirect);
        }, 2000);
        return result.success;
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
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
