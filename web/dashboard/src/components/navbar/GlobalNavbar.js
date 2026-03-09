'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function GlobalNavbar() {
    const pathname = usePathname()

    // Do not show on dashboard routes or explorer (which has its own layout or needs specific behavior)
    const isDashboard = pathname.startsWith('/dashboard')

    if (isDashboard) return null

    return <Navbar />
}
