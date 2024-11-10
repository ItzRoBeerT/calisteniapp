import Link from 'next/link'
import NavLink from './NavLink'
import { signIn } from '@/auth'

export default function Header() {
  return (
    <header className="bg-background backdrop-blur-sm bg-opacity-80 sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href={'/'}>Calistenia</Link>
        <div className="flex gap-2 items-center">
          <NavLink
            href={'/workouts'}
            className="hover:text-tertiary transition-colors ease-in"
          >
            Entrenamientos
          </NavLink>
          <NavLink
            href={'/exercises'}
            className="hover:text-tertiary transition-colors ease-in"
          >
            Ejercicios
          </NavLink>
          <form
            action={async () => {
              'use server'
              await signIn('github')
            }}
          >
            <button
              type="submit"
              className="bg-secondary rounded p-2 hover:bg-secondaryHover transition"
            >
              Signin with GitHub
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
