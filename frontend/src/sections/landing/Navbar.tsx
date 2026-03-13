import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Shield, 
  ChevronDown,
  FileText,
  Hash,
  Key,
  Webhook,
  Zap,
  Building2,
  Scale,
  GraduationCap,
  BookOpen,
  HelpCircle,
  MessageSquare,
  Users,
  Github,
  Heart,
  Globe,
  Lock,
  BarChart3,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

// Product items
const productsItems = [
  {
    title: 'Document Anchoring',
    description: 'Immutable document verification on Solana',
    icon: FileText,
    href: '/verify',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    title: 'Hash Registry',
    description: 'Cryptographic proof of existence',
    icon: Hash,
    href: '/docs/concepts/verification',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    title: 'API Platform',
    description: 'Enterprise-grade API for integration',
    icon: Key,
    href: '/docs/authentication/api-keys',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    title: 'Webhooks',
    description: 'Real-time event notifications',
    icon: Webhook,
    href: '/docs/guides/webhooks',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
  },
  {
    title: 'CLI Tool',
    description: 'Command-line interface for developers',
    icon: Zap,
    href: '/docs/cli',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
];

// Solutions items
const solutionsItems = [
  {
    title: 'Legal & Compliance',
    description: 'Tamper-proof legal documents and audit trails',
    icon: Scale,
    href: '/docs/guides/legal',
  },
  {
    title: 'Enterprise',
    description: 'Scalable solutions for large organizations',
    icon: Building2,
    href: '/enterprise',
  },
  {
    title: 'Financial Services',
    description: 'Secure document management for finance',
    icon: BarChart3,
    href: '/docs/guides/financial',
  },
  {
    title: 'Supply Chain',
    description: 'Track and verify supply chain documents',
    icon: Layers,
    href: '/solutions/supply-chain',
  },
];

// Resources - Learn items
const learnItems = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    icon: BookOpen,
    href: '/docs',
  },
  {
    title: 'Academy',
    description: 'Learn blockchain verification',
    icon: GraduationCap,
    href: '/academy',
  },
  {
    title: 'Help Center',
    description: 'FAQs and troubleshooting',
    icon: HelpCircle,
    href: '/help',
  },
  {
    title: 'Community',
    description: 'Join our Discord and forums',
    icon: MessageSquare,
    href: '/community',
  },
];

// Resources - Company & Open Source
const companyItems = [
  { title: 'About Us', href: '/about', icon: Globe },
  { title: 'Blog', href: '/blog', icon: FileText },
  { title: 'Careers', href: '/careers', icon: Users },
  { title: 'Contact', href: '/contact', icon: MessageSquare },
];

const openSourceItems = [
  { title: 'GitHub', href: 'https://github.com/leaderofARS/vdr', icon: Github, external: true },
  { title: 'Contribute', href: '/opensource', icon: Heart },
  { title: 'Security', href: '/security', icon: Lock },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileDropdown(null);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-sipheron-base/95 backdrop-blur-xl shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sipheron-purple to-sipheron-teal flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-sipheron-text-primary">
                SipHeron
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-sipheron-purple/20 text-sipheron-purple font-medium">
                VDR
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-0">
                  {/* Products Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03] data-[state=open]:bg-white/[0.05] data-[state=open]:text-sipheron-text-primary h-9 px-3">
                      Products
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[320px] p-2 bg-sipheron-surface border border-white/[0.06] rounded-md">
                        <div className="grid grid-cols-2 gap-1">
                          {productsItems.map((item) => (
                            <NavigationMenuLink asChild key={item.title}>
                              <Link
                                to={item.href}
                                className="flex flex-col items-center gap-2 p-3 rounded-md hover:bg-white/[0.03] transition-colors group text-center"
                              >
                                <div className={`p-2 rounded-md ${item.bgColor}`}>
                                  <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-sipheron-text-primary group-hover:text-sipheron-purple transition-colors">
                                    {item.title}
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Solutions Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03] data-[state=open]:bg-white/[0.05] data-[state=open]:text-sipheron-text-primary h-9 px-3">
                      Solutions
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[280px] p-2 bg-sipheron-surface border border-white/[0.06] rounded-md">
                        <div className="grid gap-0.5">
                          {solutionsItems.map((item) => (
                            <NavigationMenuLink asChild key={item.title}>
                              <Link
                                to={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/[0.03] transition-colors group"
                              >
                                <div className="p-1.5 rounded bg-sipheron-purple/10 shrink-0">
                                  <item.icon className="w-4 h-4 text-sipheron-purple" />
                                </div>
                                <span className="text-xs font-medium text-sipheron-text-primary group-hover:text-sipheron-purple transition-colors">
                                  {item.title}
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Enterprise */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/enterprise"
                        className={`h-9 px-3 flex items-center text-sm font-medium transition-colors rounded-md ${
                          isActive('/enterprise')
                            ? 'text-sipheron-purple bg-sipheron-purple/10'
                            : 'text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03]'
                        }`}
                      >
                        Enterprise
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Pricing */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/pricing"
                        className={`h-9 px-3 flex items-center text-sm font-medium transition-colors rounded-md ${
                          isActive('/pricing')
                            ? 'text-sipheron-purple bg-sipheron-purple/10'
                            : 'text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03]'
                        }`}
                      >
                        Pricing
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Resources Dropdown */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent text-sipheron-text-secondary hover:text-sipheron-text-primary hover:bg-white/[0.03] data-[state=open]:bg-white/[0.05] data-[state=open]:text-sipheron-text-primary h-9 px-3">
                      Resources
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[380px] p-2 bg-sipheron-surface border border-white/[0.06] rounded-md">
                        <div className="flex gap-2">
                          {/* Learn Section */}
                          <div className="flex-1">
                            <h4 className="text-[10px] font-semibold text-sipheron-text-muted uppercase tracking-wider mb-1 px-2">
                              Learn
                            </h4>
                            <div className="space-y-0.5">
                              {learnItems.map((item) => (
                                <NavigationMenuLink asChild key={item.title}>
                                  <Link
                                    to={item.href}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors group"
                                  >
                                    <item.icon className="w-3.5 h-3.5 text-sipheron-purple shrink-0" />
                                    <span className="text-xs text-sipheron-text-primary group-hover:text-sipheron-purple transition-colors">
                                      {item.title}
                                    </span>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>

                          {/* Company & Open Source */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <h4 className="text-[10px] font-semibold text-sipheron-text-muted uppercase tracking-wider mb-1 px-2">
                                Company
                              </h4>
                              <div className="space-y-0.5">
                                {companyItems.map((item) => (
                                  <NavigationMenuLink asChild key={item.title}>
                                    <Link
                                      to={item.href}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors group"
                                    >
                                      <item.icon className="w-3.5 h-3.5 text-sipheron-teal shrink-0" />
                                      <span className="text-xs text-sipheron-text-primary group-hover:text-sipheron-teal transition-colors">
                                        {item.title}
                                      </span>
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] font-semibold text-sipheron-text-muted uppercase tracking-wider mb-1 px-2">
                                Open Source
                              </h4>
                              <div className="space-y-0.5">
                                {openSourceItems.map((item) => (
                                  <NavigationMenuLink asChild key={item.title}>
                                    <a
                                      href={item.href}
                                      target={item.external ? '_blank' : undefined}
                                      rel={item.external ? 'noopener noreferrer' : undefined}
                                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/[0.03] transition-colors group"
                                    >
                                      <item.icon className="w-3.5 h-3.5 text-sipheron-green shrink-0" />
                                      <span className="text-xs text-sipheron-text-primary group-hover:text-sipheron-green transition-colors">
                                        {item.title}
                                      </span>
                                      {item.external && (
                                        <ArrowRight className="w-3 h-3 rotate-[-45deg] text-sipheron-text-muted ml-auto" />
                                      )}
                                    </a>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/auth/login"
                className="text-sm text-sipheron-text-secondary hover:text-sipheron-text-primary transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="text-sm bg-sipheron-purple hover:bg-sipheron-purple/90 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-sipheron-text-secondary hover:text-sipheron-text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 bg-sipheron-surface border-b border-white/[0.06] max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 space-y-2">
              {/* Products */}
              <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'products' ? null : 'products')}
                  className="w-full flex items-center justify-between p-3 text-sipheron-text-primary font-medium"
                >
                  <span>Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === 'products' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'products' && (
                  <div className="px-3 pb-3 space-y-1">
                    {productsItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className={`p-1.5 rounded ${item.bgColor}`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <span className="text-sm text-sipheron-text-secondary">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions */}
              <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'solutions' ? null : 'solutions')}
                  className="w-full flex items-center justify-between p-3 text-sipheron-text-primary font-medium"
                >
                  <span>Solutions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === 'solutions' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'solutions' && (
                  <div className="px-3 pb-3 space-y-1">
                    {solutionsItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.href}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="p-1.5 rounded bg-sipheron-purple/10">
                          <item.icon className="w-4 h-4 text-sipheron-purple" />
                        </div>
                        <span className="text-sm text-sipheron-text-secondary">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Enterprise */}
              <Link
                to="/enterprise"
                className="block p-3 text-sipheron-text-primary font-medium border border-white/[0.06] rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Enterprise
              </Link>

              {/* Pricing */}
              <Link
                to="/pricing"
                className="block p-3 text-sipheron-text-primary font-medium border border-white/[0.06] rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              {/* Resources */}
              <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'resources' ? null : 'resources')}
                  className="w-full flex items-center justify-between p-3 text-sipheron-text-primary font-medium"
                >
                  <span>Resources</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === 'resources' ? 'rotate-180' : ''}`} />
                </button>
                {mobileDropdown === 'resources' && (
                  <div className="px-3 pb-3 space-y-4">
                    {/* Learn */}
                    <div>
                      <h4 className="text-xs font-semibold text-sipheron-text-muted uppercase mb-2">Learn</h4>
                      <div className="space-y-1">
                        {learnItems.map((item) => (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 text-sipheron-purple" />
                            <span className="text-sm text-sipheron-text-secondary">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Company */}
                    <div>
                      <h4 className="text-xs font-semibold text-sipheron-text-muted uppercase mb-2">Company</h4>
                      <div className="space-y-1">
                        {companyItems.map((item) => (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 text-sipheron-teal" />
                            <span className="text-sm text-sipheron-text-secondary">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Open Source */}
                    <div>
                      <h4 className="text-xs font-semibold text-sipheron-text-muted uppercase mb-2">Open Source</h4>
                      <div className="space-y-1">
                        {openSourceItems.map((item) => (
                          <a
                            key={item.title}
                            href={item.href}
                            target={item.external ? '_blank' : undefined}
                            rel={item.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4 text-sipheron-green" />
                            <span className="text-sm text-sipheron-text-secondary">{item.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-white/[0.06] my-4" />

              {/* Mobile CTAs */}
              <Link
                to="/auth/login"
                className="block w-full p-3 text-center text-sipheron-text-secondary border border-white/[0.06] rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="block w-full p-3 text-center bg-sipheron-purple text-white rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
