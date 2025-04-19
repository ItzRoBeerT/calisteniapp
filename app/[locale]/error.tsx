"use client"

import { useEffect } from 'react'
import { AppError } from '@/utils/errors'

interface ErrorProps {
  error: Error
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registrar el error en un servicio de análisis
    console.error('Error en la aplicación:', error)
  }, [error])

  // Determinar si es un error personalizado de la aplicación
  const isAppError = error instanceof AppError
  const statusCode = isAppError ? (error as AppError).statusCode : 500
  const errorMessage = error.message || 'Ha ocurrido un error inesperado'

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 bg-background text-foreground absolute top-0 left-0 right-0 z-50">
      <div className="max-w-md w-full rounded-xl bg-surface p-8 shadow-lg border border-primary-700/30 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-primary-500/10 p-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-primary-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-primary-500">{statusCode}</h1>
          <h2 className="mb-4 text-2xl font-semibold text-white">¡Ups! Algo salió mal</h2>
          <p className="mb-8 text-gray-400">{errorMessage}</p>
          
          <div className="w-full">
            <button
              onClick={reset}
              className="w-full rounded-lg bg-primary-500 px-5 py-2.5 font-semibold text-black transition-all hover:bg-primary-400 focus:ring-2 focus:ring-primary-500/50"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
