"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS } from "@/app/constants/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-10">
        <Link
          href="/"
          className="text-lg font-semibold text-slate-900"
          onClick={closeMenu}
        >
          Hunch 
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow"
                    : "hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition hover:border-slate-400 hover:text-slate-900 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
          >
            {isOpen ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      <nav
        className={`md:hidden ${
          isOpen ? "max-h-screen border-t border-slate-200" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="space-y-1 px-4 pb-4 pt-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "bg-white/80 text-slate-600 ring-1 ring-slate-100 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
