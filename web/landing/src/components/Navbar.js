'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Shield, ArrowRight, Search, Menu, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import AnnouncementBar from './AnnouncementBar'
import NavDropdown from './NavDropdown'
import MobileNav from './MobileNav'
import DocsSearch from '../../app/docs/components/DocsSearch'

const navItems = [
    {
        label: 'Product',
        dropdown: 'product',
        sections: [
            {
                title: 'CORE PLATFORM',
                items: [
                    {
                        icon: '⬡',
                        label: 'Hash Registry',
                        description: 'Anchor SHA-256 hashes on Solana',
                        href: '/#how-it-works',
                        color: '#9B6EFF'
                    },
                    {
                        icon: '✓',
                        label: 'Verification',
                        description: 'Instant, trustless proof of authenticity',
                        href: '/#verification',
                        color: '#4F6EF7'
                    },
                    {
                        icon: '⚡',
                        label: 'CLI Tool',
                        description: '3-command workflow, any file type',
                        href: '/#cli',
                        color: '#10B981'
                    },
                    {
                        icon: '🔑',
                        label: 'API Access',
                        description: 'REST API with full programmatic control',
                        href: '/docs/api',
                        color: '#F59E0B'
                    }
                ]
            },
            {
                title: 'PLATFORM',
                items: [
                    {
                        icon: '⚙',
                        label: 'Dashboard',
                        description: 'Manage hashes, keys, and org settings',
                        href: 'https://app.sipheron.com',
                        color: '#9B6EFF',
                        external: true
                    },
                    {
                        icon: '🔔',
                        label: 'Webhooks',
                        description: 'Real-time event notifications',
                        href: '/docs/guides/webhooks',
                        color: '#4F6EF7'
                    },
                    {
                        icon: '📊',
                        label: 'Analytics',
                        description: 'Usage metrics and audit logs',
                        href: '/docs/api/usage',
                        color: '#10B981'
                    }
                ]
            }
        ],
        featured: {
            label: 'New in v0.9.4',
            title: 'Bulk Hash Registration',
            description: 'Register up to 100 document hashes in a single transaction.',
            href: '/docs/changelog',
            cta: 'See changelog →'
        }
    },
    {
        label: 'Use Cases',
        dropdown: 'usecases',
        sections: [
            {
                title: 'BY INDUSTRY',
                items: [
                    {
                        icon: '⚖',
                        label: 'Legal',
                        description: 'Contracts, NDAs, court filings',
                        href: '/docs/guides/legal',
                        color: '#9B6EFF'
                    },
                    {
                        icon: '📈',
                        label: 'Finance',
                        description: 'Audit trails, financial reports',
                        href: '/docs/guides/financial',
                        color: '#4F6EF7'
                    },
                    {
                        icon: '🏥',
                        label: 'Healthcare',
                        description: 'Medical records, consent forms',
                        href: '/#use-cases',
                        color: '#10B981'
                    },
                    {
                        icon: '🎓',
                        label: 'Education',
                        description: 'Diplomas, transcripts, certifications',
                        href: '/#use-cases',
                        color: '#F59E0B'
                    }
                ]
            },
            {
                title: 'BY WORKFLOW',
                items: [
                    {
                        icon: '🔄',
                        label: 'CI/CD Pipeline',
                        description: 'Verify build artifacts automatically',
                        href: '/docs/guides/cicd',
                        color: '#9B6EFF'
                    },
                    {
                        icon: '🏢',
                        label: 'Enterprise',
                        description: 'Multi-user orgs, audit logs, RBAC',
                        href: '/docs/guides/enterprise',
                        color: '#4F6EF7'
                    },
                    {
                        icon: '🖥',
                        label: 'Developer Tools',
                        description: 'SDK, webhooks, REST API',
                        href: '/docs/api',
                        color: '#10B981'
                    }
                ]
            }
        ]
    },
    {
        label: 'Docs',
        dropdown: 'docs',
        sections: [
            {
                title: 'GET STARTED',
                items: [
                    {
                        icon: '🚀',
                        label: 'Quick Start',
                        description: 'Up and running in 2 minutes',
                        href: '/docs/quickstart',
                        color: '#9B6EFF'
                    },
                    {
                        icon: '⌨',
                        label: 'CLI Reference',
                        description: 'All commands and options',
                        href: '/docs/cli',
                        color: '#4F6EF7'
                    },
                    {
                        icon: '🔌',
                        label: 'API Reference',
                        description: 'REST API full documentation',
                        href: '/docs/api',
                        color: '#10B981'
                    },
                    {
                        icon: '📦',
                        label: 'JavaScript SDK',
                        description: 'Node.js + browser SDK',
                        href: '/docs/sdks/javascript',
                        color: '#F59E0B'
                    }
                ]
            },
            {
                title: 'RESOURCES',
                items: [
                    {
                        icon: '📝',
                        label: 'Changelog',
                        description: 'Latest updates and releases',
                        href: '/docs/changelog',
                        color: '#9B6EFF'
                    },
                    {
                        icon: '💬',
                        label: 'Blog',
                        description: 'Technical articles and guides',
                        href: '/docs/blog',
                        color: '#4F6EF7'
                    },
                    {
                        icon: '🐙',
                        label: 'GitHub',
                        description: 'Open source on GitHub',
                        href: 'https://github.com/leaderofARS/vdr',
                        color: '#10B981',
                        external: true
                    }
                ]
            }
        ]
    },
    { label: 'Pricing', href: '/pricing' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const pathname = usePathname()
    const timeoutRef = useRef(null)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20)

            const winScroll = document.body.scrollTop || document.documentElement.scrollTop
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
            const scrolledProgress = (winScroll / height) * 100
            setScrollProgress(scrolledProgress)
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [mobileOpen])

    const openDropdown = (name) => {
        clearTimeout(timeoutRef.current)
        setActiveDropdown(name)
    }

    const closeDropdown = () => {
        timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150)
    }

    return (
        <>
            <AnnouncementBar />

            {pathname === '/' && (
                <div
                    className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[#9B6EFF] to-[#4F6EF7] transition-all duration-100 ease-out"
                    style={{ width: `${scrollProgress}%` }}
                />
            )}

            <header
                style={{
                    background: scrolled ? 'rgba(8, 8, 15, 0.92)' : 'rgba(8, 8, 15, 0.75)',
                    borderBottom: `1px solid ${scrolled ? 'rgba(155, 110, 255, 0.15)' : 'rgba(155, 110, 255, 0.06)'}`,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="fixed left-0 right-0 z-[150] h-12 flex items-center"
            >
                <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                            <img
                                src="/sipheron_vdap_logo.png"
                                alt="SipHeron Logo"
                                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(155,110,255,0.3)]"
                            />
                        </div>
                        <span className="text-[15px] font-bold tracking-tight text-[#EDEDED] hidden sm:block">
                            SipHeron
                        </span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map(item => (
                            <div key={item.label} className="relative h-12 flex items-center">
                                <NavTrigger
                                    item={item}
                                    isActive={activeDropdown === item.dropdown || (item.href && pathname === item.href)}
                                    onOpen={openDropdown}
                                    onClose={closeDropdown}
                                />
                                <AnimatePresence>
                                    {item.dropdown && activeDropdown === item.dropdown && (
                                        <NavDropdown
                                            item={item}
                                            activeDropdown={activeDropdown}
                                            openDropdown={openDropdown}
                                            closeDropdown={closeDropdown}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {pathname.startsWith('/docs') && (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.1] rounded-lg text-[#888] text-[12px] hover:border-white/[0.2] transition-colors"
                            >
                                <Search className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">Search...</span>
                                <kbd className="hidden md:inline ml-2 text-[10px] opacity-30">⌘K</kbd>
                            </button>
                        )}
                        <div className="hidden lg:flex items-center gap-3">
                            <Link
                                href="/auth/login"
                                className="text-[13px] text-[#888] hover:text-[#EDEDED] transition-colors px-3 py-1.5"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="relative group flex items-center gap-1.5 text-[13px] font-medium text-white px-4 py-1.5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#9B6EFF]/20 hover:-translate-y-0.5"
                                style={{ background: 'linear-gradient(135deg, #7C5CBF, #4F6EF7)' }}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                <span className="relative">Get Started Free</span>
                                <ArrowRight className="relative w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>

                        <button
                            className="lg:hidden p-2 -mr-2 text-[#888] hover:text-[#EDEDED] transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            <HamburgerIcon isOpen={mobileOpen} />
                        </button>
                    </div>
                </div>
            </header>

            <MobileNav open={mobileOpen} items={navItems} onClose={() => setMobileOpen(false)} />
            {isSearchOpen && <DocsSearch onClose={() => setIsSearchOpen(false)} />}
        </>
    )
}

function NavTrigger({ item, isActive, onOpen, onClose }) {
    const pathname = usePathname()
    const isSectionActive = pathname.startsWith('/docs') && item.label === 'Docs'

    return (
        <div
            onMouseEnter={() => item.dropdown ? onOpen(item.dropdown) : null}
            onMouseLeave={() => item.dropdown ? onClose() : null}
            className="relative group h-full flex items-center"
        >
            {item.href ? (
                <Link
                    href={item.href}
                    className="relative flex items-center gap-1.5 px-4 py-1 text-[13px] transition-colors duration-200"
                    style={{ color: isActive ? '#EDEDED' : '#888' }}
                >
                    {item.label}
                    <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#9B6EFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : ''}`} />
                </Link>
            ) : (
                <button
                    className="relative flex items-center gap-1.5 px-4 py-1 text-[13px] transition-colors duration-200"
                    style={{ color: isActive ? '#EDEDED' : '#888' }}
                >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'rotate-180 text-[#9B6EFF]' : ''}`} />

                    {isSectionActive && !isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#9B6EFF] shadow-[0_0_8px_rgba(155,110,255,0.8)]" />
                    )}

                    <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#9B6EFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : ''}`} />
                </button>
            )}
        </div>
    )
}

function HamburgerIcon({ isOpen }) {
    return (
        <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5 cursor-pointer">
            <span className={`h-[1.5px] w-5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
            <span className={`h-[1.5px] w-5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`h-[1.5px] w-5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
        </div>
    )
}
