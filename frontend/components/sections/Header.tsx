'use client';

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('userLogin', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogin', handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsLoading(false)
      router.push('/')
    }
  }

  return (
    <header className="w-full bg-[#18181b] border-b border-[#3f3f46]">
      <div className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[#fafafa] font-bold text-xl">
            Pass<span className="text-[#f59e0b]">Master</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            href="/event" 
            className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm"
          >
            Esdeveniments
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/profile"
                className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm"
              >
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm disabled:opacity-50"
              >
                {isLoading ? 'Sortint...' : 'Sortir'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/auth/login" 
                className="text-[#a1a1aa] hover:text-[#fafafa] transition-colors text-sm"
              >
                Iniciar sessió
              </Link>
              <Link 
                href="/auth/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Registrar-se
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}