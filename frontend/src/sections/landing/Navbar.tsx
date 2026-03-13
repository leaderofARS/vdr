import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Search } from 'lucide-react';

// Nav items configuration matching the dashboard
const navItems = [
  {
    label: 'Product',
    dropdown: 'product',
    sections: [
      {
        title: 'CORE PLATFORM',
        items: [
          { icon: '⬡', label: 'Hash Registry', description: 'Anchor SHA-256 hashes on Solana', href: '/verify', color: '#9B6EFF' },
          { icon: '✓', label: 'Verification', description: 'Instant, trustless proof of authenticity', href: '/verify', color: '#4F6EF7' },
          { icon: '⚡', label: 'CLI Tool', description: '3-command workflow, any file type', href: '/docs/cli', color: '#10B981' },
          { icon: '🔑', label: 'API Access', description: 'REST API with full programmatic control', href: '/docs/authentication/api-keys', color: '#F59E0B' },
        ]
      },
      {
        title: 'PLATFORM',
        items: [
          { icon: '⚙', label: 'Dashboard', description: 'Manage hashes, keys, and org settings', href: '/dashboard', color: '#9B6EFF' },
          { icon: '🔔', label: 'Webhooks', description: 'Real-time event notifications', href: '/docs/guides/webhooks', color: '#4F6EF7' },
          { icon: '📊', label: 'Analytics', description: 'Usage metrics and audit logs', href: '/docs/api/usage', color: '#10B981' },
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
          { icon: '⚖', label: 'Legal', description: 'Contracts, NDAs, court filings', href: '/docs/guides/legal', color: '#9B6EFF' },
          { icon: '📈', label: 'Finance', description: 'Audit trails, financial reports', href: '/docs/guides/financial', color: '#4F6EF7' },
          { icon: '🏥', label: 'Healthcare', description: 'Medical records, consent forms', href: '/#use-cases', color: '#10B981' },
          { icon: '🎓', label: 'Education', description: 'Diplomas, transcripts, certifications', href: '/#use-cases', color: '#F59E0B' },
        ]
      },
      {
        title: 'BY WORKFLOW',
        items: [
          { icon: '🔄', label: 'CI/CD Pipeline', description: 'Verify build artifacts automatically', href: '/docs/guides/cicd', color: '#9B6EFF' },
          { icon: '🏢', label: 'Enterprise', description: 'Multi-user orgs, audit logs, RBAC', href: '/docs/guides/enterprise', color: '#4F6EF7' },
          { icon: '🖥', label: 'Developer Tools', description: 'SDK, webhooks, REST API', href: '/docs/api', color: '#10B981' },
        ]
      }
    ]
  },
  {
    label: 'Resources',
    dropdown: 'resources',
    sections: [
      {
        title: 'GET STARTED',
        items: [
          { icon: '🚀', label: 'Quick Start', description: 'Up and running in 2 minutes', href: '/docs/quickstart', color: '#9B6EFF' },
          { icon: '⌨', label: 'CLI Reference', description: 'All commands and options', href: '/docs/cli', color: '#4F6EF7' },
          { icon: '🔌', label: 'API Reference', description: 'REST API full documentation', href: '/docs/api', color: '#10B981' },
          { icon: '📦', label: 'JavaScript SDK', description: 'Node.js + browser SDK', href: '/docs/sdks/javascript', color: '#F59E0B' },
        ]
      },
      {
        title: 'RESOURCES',
        items: [
          { icon: '📝', label: 'Changelog', description: 'Latest updates and releases', href: '/docs/changelog', color: '#9B6EFF' },
          { icon: '💬', label: 'Blog', description: 'Technical articles and guides', href: '/blog', color: '#4F6EF7' },
          { icon: '🐙', label: 'GitHub', description: 'Open source on GitHub', href: 'https://github.com/leaderofARS/vdr', color: '#10B981', external: true },
        ]
      }
    ]
  },
  { label: 'Pricing', href: '/pricing' },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolledProgress = (winScroll / height) * 100;
      setScrollProgress(scrolledProgress);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileOpen]);

  const openDropdown = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(name);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const isActive = (href?: string) => href ? location.pathname === href : false;

  return (
    <>
      {/* Progress bar on homepage */}
      {isHome && (
        <div
          className="fixed top-0 left-0 z-[100] h-[2px] bg-gradient-to-r from-[#9B6EFF] to-[#4F6EF7] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      )}

      <header
        className="fixed left-0 right-0 z-[150] h-12 flex items-center"
        style={{
          background: scrolled ? 'rgba(8, 8, 15, 0.92)' : 'rgba(8, 8, 15, 0.75)',
          borderBottom: `1px solid ${scrolled ? 'rgba(155, 110, 255, 0.15)' : 'rgba(155, 110, 255, 0.06)'}`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <div 
                key={item.label} 
                className="relative h-12 flex items-center"
                onMouseEnter={() => item.dropdown ? openDropdown(item.dropdown) : null}
                onMouseLeave={() => item.dropdown ? closeDropdown() : null}
              >
                <NavTrigger
                  item={item}
                  isActive={activeDropdown === item.dropdown || (!!item.href && isActive(item.href))}
                  
                />
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.dropdown && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onMouseEnter={() => openDropdown(item.dropdown!)}
                      onMouseLeave={closeDropdown}
                      onMouseMove={handleMouseMove}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1"
                      style={{
                        background: `radial-gradient(300px at ${mousePos.x}px ${mousePos.y}px, rgba(155,110,255,0.06), transparent 80%), rgba(10, 10, 18, 0.97)`,
                        border: '1px solid rgba(155, 110, 255, 0.12)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(155,110,255,0.05)',
                        minWidth: item.featured ? '560px' : '480px',
                        zIndex: 100
                      }}
                    >
                      {/* Purple gradient top border */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#9B6EFF]/40 to-transparent rounded-t-2xl" />

                      <div className="p-5 flex gap-8">
                        {/* Sections */}
                        <div className={`flex gap-8 ${item.featured ? 'flex-[2]' : 'flex-1'}`}>
                          {item.sections.map(section => (
                            <div key={section.title} className="flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#555] mb-3 px-3">
                                {section.title}
                              </p>
                              <div className="space-y-0.5">
                                {section.items.map(subItem => (
                                  <DropdownItem key={subItem.href} item={subItem} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Featured card */}
                        {item.featured && <FeaturedCard card={item.featured} />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search button - show on docs pages */}
            {location.pathname.startsWith('/docs') && (
              <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.1] rounded-lg text-[#888] text-[12px] hover:border-white/[0.2] transition-colors">
                <Search className="w-3.5 h-3.5" />
                <span>Search...</span>
                <kbd className="ml-2 text-[10px] opacity-30">⌘K</kbd>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/auth/login"
                className="text-[13px] text-[#888] hover:text-[#EDEDED] transition-colors px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="relative group flex items-center gap-1.5 text-[13px] font-medium text-white px-4 py-1.5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#9B6EFF]/20 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7C5CBF, #4F6EF7)' }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                <span className="relative">Get Started Free</span>
                <ArrowRight className="relative w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -mr-2 text-[#888] hover:text-[#EDEDED] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <HamburgerIcon isOpen={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <MobileNav open={mobileOpen} items={navItems} onClose={() => setMobileOpen(false)} />
    </>
  );
};

// Nav Trigger Component
interface NavTriggerProps {
  item: {
    label: string;
    href?: string;
    dropdown?: string;
  };
  isActive: boolean;
  
}

const NavTrigger: React.FC<NavTriggerProps> = ({ item, isActive }) => {
  const location = useLocation();
  const isSectionActive = location.pathname.startsWith('/docs') && item.label === 'Docs';

  if (item.href) {
    return (
      <Link
        to={item.href}
        className="relative flex items-center gap-1.5 px-4 py-1 text-[13px] transition-colors duration-200 group"
        style={{ color: isActive ? '#EDEDED' : '#888' }}
      >
        {item.label}
        <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#9B6EFF] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : ''}`} />
      </Link>
    );
  }

  return (
    <button
      className="relative flex items-center gap-1.5 px-4 py-1 text-[13px] transition-colors duration-200"
      style={{ color: isActive ? '#EDEDED' : '#888' }}
    >
      {item.label}
      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? 'rotate-180 text-[#9B6EFF]' : ''}`} />

      {isSectionActive && !isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#9B6EFF] shadow-[0_0_8px_rgba(155,110,255,0.8)]" />
      )}

      <span className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#9B6EFF] scale-x-0 hover:scale-x-100 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : ''}`} />
    </button>
  );
};

// Dropdown Item Component
interface DropdownItemProps {
  item: {
    icon: string;
    label: string;
    description: string;
    href: string;
    color: string;
    external?: boolean;
  };
}

const DropdownItem: React.FC<DropdownItemProps> = ({ item }) => {
  return (
    <Link
      to={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      className="group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-all duration-100 hover:bg-white/[0.03] relative overflow-hidden"
    >
      {/* Left border indicator on hover */}
      <div className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#9B6EFF] opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon */}
      <div
        className="mt-0.5 w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all duration-150 group-hover:scale-110 shadow-sm"
        style={{
          background: `${item.color}15`,
          border: `1px solid ${item.color}25`,
          color: item.color
        }}
      >
        <span className="text-sm">{item.icon}</span>
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-[#EDEDED] group-hover:text-white transition-colors leading-none">
            {item.label}
          </span>
          {item.external && <span className="text-[10px] text-[#555]">↗</span>}
        </div>
        <p className="text-[12px] text-[#555] group-hover:text-[#888] transition-colors mt-0.5 leading-snug line-clamp-1">
          {item.description}
        </p>
      </div>
    </Link>
  );
};

// Featured Card Component
interface FeaturedCardProps {
  card: {
    label: string;
    title: string;
    description: string;
    href: string;
    cta: string;
  };
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ card }) => {
  return (
    <div className="w-[180px] shrink-0 border-l border-[#1A1A2E] pl-6 hidden md:block">
      <Link
        to={card.href}
        className="block rounded-xl p-3 border border-[#9B6EFF]/20 bg-[#9B6EFF]/5 hover:bg-[#9B6EFF]/10 transition-all cursor-pointer group shadow-[0_0_20px_rgba(155,110,255,0.05)]"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B6EFF] block mb-2">
          {card.label}
        </span>
        <p className="text-[13px] font-semibold text-[#EDEDED] leading-snug mb-2">
          {card.title}
        </p>
        <p className="text-[11px] text-[#555] leading-relaxed mb-3">
          {card.description}
        </p>
        <span className="text-[12px] text-[#9B6EFF] group-hover:text-[#B794FF] transition-colors flex items-center gap-1 font-medium">
          {card.cta}
        </span>
      </Link>
    </div>
  );
};

// Hamburger Icon Component
const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div className="w-5 h-5 flex flex-col justify-center items-center gap-1.5 cursor-pointer">
      <span className={`h-[1.5px] w-5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
      <span className={`h-[1.5px] w-5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0 scale-x-0' : ''}`} />
      <span className={`h-[1.5px] w-5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
    </div>
  );
};

// Mobile Nav Component
interface MobileNavProps {
  open: boolean;
  items: typeof navItems;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ open, items, onClose }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] lg:hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-12 right-0 bottom-0 w-full max-w-sm bg-[#08080F] border-l border-white/[0.06] overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {items.map(item => (
            <div key={item.label}>
              {item.href ? (
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="text-[15px] font-medium text-[#EDEDED]"
                >
                  {item.label}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full text-[15px] font-medium text-[#EDEDED]"
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expanded === item.label && item.sections && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 space-y-4">
                          {item.sections.map(section => (
                            <div key={section.title}>
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#555] mb-2">
                                {section.title}
                              </p>
                              <div className="space-y-1">
                                {section.items.map(subItem => (
                                  <Link
                                    key={subItem.href}
                                    to={subItem.href}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.03]"
                                  >
                                    <span className="text-lg">{subItem.icon}</span>
                                    <div>
                                      <span className="text-[13px] text-[#EDEDED]">{subItem.label}</span>
                                      <p className="text-[11px] text-[#555]">{subItem.description}</p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 border-t border-white/[0.06] space-y-3">
            <Link
              to="/auth/login"
              onClick={onClose}
              className="block w-full py-3 text-center text-[#888] border border-white/[0.1] rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/auth/register"
              onClick={onClose}
              className="block w-full py-3 text-center text-white rounded-lg"
              style={{ background: 'linear-gradient(135deg, #7C5CBF, #4F6EF7)' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;
