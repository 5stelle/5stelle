'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  MessageSquare,
  FileEdit,
  QrCode,
  Link2,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Feedback', icon: MessageSquare },
  { href: '/dashboard/form-builder', label: 'Modulo', icon: FileEdit },
  { href: '/dashboard/qr-codes', label: 'QR Code', icon: QrCode },
  { href: '/dashboard/links', label: 'Link', icon: Link2 },
  { href: '/dashboard/settings', label: 'Impostazioni', icon: Settings },
  { href: '/dashboard/billing', label: 'Abbonamento', icon: CreditCard },
]

interface SidebarProps {
  restaurantName: string
}

export function Sidebar({ restaurantName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const NavLinks = () => (
    <nav className="flex-1 p-4">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  const LogoutButton = () => (
    <div className="p-4 border-t">
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        onClick={handleSignOut}
        disabled={isLoggingOut}
      >
        <LogOut className="h-5 w-5" />
        {isLoggingOut ? 'Uscita...' : 'Esci'}
      </Button>
    </div>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <Image src="/logo-5stelle-single.svg" alt="5stelle" width={24} height={24} className="shrink-0" />
        <h1 className="font-bold text-lg truncate flex-1 text-center pr-10">{restaurantName}</h1>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 w-64 bg-background border-r z-50 flex flex-col transition-transform duration-200',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile sidebar header with close button */}
        <div className="p-6 border-b flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Image src="/logo-5stelle-single.svg" alt="5stelle" width={28} height={28} className="shrink-0" />
            <h1 className="font-bold text-xl truncate">{restaurantName}</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <NavLinks />
        <LogoutButton />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 bg-background border-r flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Image src="/logo-5stelle-single.svg" alt="5stelle" width={28} height={28} className="shrink-0" />
            <h1 className="font-bold text-xl truncate">{restaurantName}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Dashboard</p>
        </div>
        <NavLinks />
        <LogoutButton />
      </aside>
    </>
  )
}
