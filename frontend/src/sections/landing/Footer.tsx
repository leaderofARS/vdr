import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Docs', href: '#docs' },
      { label: 'Changelog', href: '#changelog' },
      { label: 'Status', href: '#' },
    ],
  },
  developers: {
    title: 'Developers',
    links: [
      { label: 'API Reference', href: '#' },
      { label: 'CLI Reference', href: '#' },
      { label: 'SDKs', href: '#' },
      { label: 'GitHub', href: '#' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-sipheron-base border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/sipheron_vdap_logo.png"
                  alt="SipHeron Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(155,110,255,0.3)]"
                />
              </div>
              <span className="text-lg font-semibold text-sipheron-text-primary">
                SipHeron
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-sipheron-purple/20 text-sipheron-purple font-medium">
                VDR
              </span>
            </Link>
            <p className="text-sm text-sipheron-text-secondary mb-6 max-w-xs">
              Blockchain document verification built on Solana. Tamper-proof. Permanent. Verifiable.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="
                      w-9 h-9 rounded-lg
                      flex items-center justify-center
                      bg-white/[0.03] border border-white/[0.06]
                      text-sipheron-text-muted
                      hover:text-sipheron-text-primary hover:bg-white/[0.06]
                      transition-all duration-200
                    "
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-sipheron-text-primary mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-sipheron-text-muted">
              &copy; 2025 SipHeron VDR. Built on Solana.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-xs text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
              >
                Privacy
              </a>
              <span className="text-sipheron-text-muted">·</span>
              <a
                href="#"
                className="text-xs text-sipheron-text-muted hover:text-sipheron-text-primary transition-colors"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
