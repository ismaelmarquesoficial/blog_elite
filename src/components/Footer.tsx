import React from 'react';
import { Camera, Github, Twitter, Instagram } from 'lucide-react';

const socialLinks = [
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' }
];

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' }
];

export function Footer() {
  return (
    <footer className="border-t border-purple-900/20 bg-gray-900/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Camera className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Modern Gallery
            </span>
          </div>

          <div className="flex gap-6">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {footerLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Modern Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}