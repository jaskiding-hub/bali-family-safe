import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { url, props } = usePage();
    const admin = props.auth?.admin;
    const pendingCount = props.pending_bookings_count || 0;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navItems = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1.5" />
                    <rect width="7" height="7" x="14" y="3" rx="1.5" />
                    <rect width="7" height="7" x="14" y="14" rx="1.5" />
                    <rect width="7" height="7" x="3" y="14" rx="1.5" />
                </svg>
            ),
        },
        {
            name: 'Financial Report',
            href: '/admin/financial-report',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
            ),
        },
        {
            name: 'Booking Management',
            href: '/admin/bookings',
            badge: pendingCount,
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
        {
            name: 'Calendar',
            href: '/admin/calendar',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
            ),
        },
        {
            name: 'Website Content',
            href: '/admin/website-content',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                    <line x1="4" x2="20" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="20" y2="9" />
                </svg>
            ),
        },
    ];

    const isActive = (itemHref) => {
        if (itemHref === '/admin/dashboard') {
            return url === '/admin/dashboard' || url === '/admin';
        }
        return url.startsWith(itemHref);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/admin/logout');
    };

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userInitial = admin?.name ? admin.name.charAt(0).toUpperCase() : 'A';

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-row antialiased text-slate-800">
            <Head title={title} />

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A2540] flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800/50 shadow-xl ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col">
                    {/* Brand Header */}
                    <div className="px-6 mb-8 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00AEEF] to-[#38BDF8] flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                <circle cx="7" cy="17" r="2" />
                                <circle cx="17" cy="17" r="2" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-white font-bold text-base leading-tight tracking-tight">
                                Bali Family Safe
                            </h2>
                            <p className="text-slate-400 font-medium text-xs tracking-wider uppercase mt-0.5">
                                Admin Console
                            </p>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex flex-col gap-1.5 px-3">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                                        active
                                            ? 'bg-[#00AEEF] text-white font-semibold shadow-md shadow-sky-500/25'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`transition-colors ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                    </div>

                                    {/* Notification Badge */}
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span
                                            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full transition-all ${
                                                active
                                                    ? 'bg-white text-sky-700 shadow-xs ring-2 ring-white/20'
                                                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="px-4">
                    <div className="pt-4 border-t border-slate-800 flex flex-col gap-1">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 py-2 px-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-colors"
                        >
                            <svg className="w-4.5 h-4.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" x2="22" y1="12" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span>View Public Site</span>
                        </a>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 py-2 px-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left w-full"
                        >
                            <svg className="w-4.5 h-4.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Header */}
                <header className="box-border h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
                            aria-label="Toggle Navigation"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page Title */}
                        <div>
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight">
                                {title}
                            </h1>
                        </div>
                    </div>

                    {/* Header Right Area */}
                    <div className="flex items-center gap-3">
                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-3 rounded-full hover:bg-slate-50 transition-all cursor-pointer border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00AEEF] to-[#38BDF8] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                                    {userInitial}
                                </div>
                                <div className="flex flex-col text-left hidden sm:flex">
                                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                                        {admin?.name || 'Admin User'}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium leading-tight">
                                        Administrator
                                    </span>
                                </div>
                                <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-sky-500' : 'group-hover:text-slate-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-slate-100/80">
                                    <div className="px-4 py-3 bg-slate-50/50 rounded-t-2xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                                        <p className="text-xs font-bold text-slate-900 truncate mt-0.5">{admin?.name || 'Admin'}</p>
                                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{admin?.email || 'admin@bfs.test'}</p>
                                    </div>
                                    <div className="py-1">
                                        <a
                                            href="/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="2" x2="22" y1="12" y2="12" />
                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                            </svg>
                                            <span>View Public Site</span>
                                        </a>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer"
                                        >
                                            <svg className="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" x2="9" y1="12" y2="12" />
                                            </svg>
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
