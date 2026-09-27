import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';

export default function AdminLayout({ children, title = 'Dashboard' }) {
    const { url, props } = usePage();
    const admin = props.auth?.admin;
    const pendingCount = props.pending_bookings_count || 0;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
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
            name: 'Master Data',
            href: '/admin/master-data',
            icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3" />
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
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

            {/* Mobile "More Menu" Bottom Sheet Overlay */}
            {moreMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
                    onClick={() => setMoreMenuOpen(false)}
                />
            )}

            {/* Mobile Bottom Sheet Modal for "More" */}
            {moreMenuOpen && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl p-5 border-t border-slate-200 lg:hidden animate-in slide-in-from-bottom duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#00AEEF] flex items-center justify-center font-bold text-xs">
                                BFS
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Menu Lainnya</h3>
                                <p className="text-[11px] text-slate-400">Pintasan navigasi admin</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMoreMenuOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 py-4">
                        <Link
                            href="/admin/financial-report"
                            onClick={() => setMoreMenuOpen(false)}
                            className={`p-3.5 rounded-2xl border flex flex-col gap-2 transition ${
                                isActive('/admin/financial-report')
                                    ? 'bg-sky-50 border-sky-200 text-[#00AEEF]'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                            }`}
                        >
                            <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect width="20" height="14" x="2" y="5" rx="2" />
                                <line x1="2" x2="22" y1="10" y2="10" />
                            </svg>
                            <div className="text-left">
                                <p className="text-xs font-bold leading-tight">Financial Report</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Laporan omset & laba</p>
                            </div>
                        </Link>

                        <Link
                            href="/admin/website-content"
                            onClick={() => setMoreMenuOpen(false)}
                            className={`p-3.5 rounded-2xl border flex flex-col gap-2 transition ${
                                isActive('/admin/website-content')
                                    ? 'bg-sky-50 border-sky-200 text-[#00AEEF]'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                            }`}
                        >
                            <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
                                <line x1="4" x2="20" y1="9" y2="9" />
                                <line x1="9" x2="9" y1="20" y2="9" />
                            </svg>
                            <div className="text-left">
                                <p className="text-xs font-bold leading-tight">Website Content</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">CMS halaman landing</p>
                            </div>
                        </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200/80 min-h-[44px]"
                        >
                            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" x2="22" y1="12" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            <span>Buka Situs Publik</span>
                        </a>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 min-h-[44px] cursor-pointer"
                        >
                            <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                            <span>Sign Out / Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar Desktop & Mobile drawer */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0A2540] flex flex-col justify-between py-6 transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800/50 shadow-xl ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex flex-col">
                    {/* Brand Header */}
                    <div className="px-6 mb-8">
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
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 group min-h-[44px] ${
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
                            className="flex items-center gap-2.5 py-2.5 px-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
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
                            className="flex items-center gap-2.5 py-2.5 px-3 text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors cursor-pointer text-left w-full min-h-[44px]"
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
                <header className="box-border h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-slate-600 rounded-xl lg:hidden hover:bg-slate-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                            aria-label="Toggle Navigation"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page Title */}
                        <div>
                            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">
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
                                className="flex items-center gap-2 py-1.5 pl-1.5 pr-2.5 sm:pr-3 rounded-full hover:bg-slate-50 transition-all cursor-pointer border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs group min-h-[40px]"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00AEEF] to-[#38BDF8] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
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
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors min-h-[44px]"
                                        >
                                            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="2" x2="22" y1="12" y2="12" />
                                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
                                            </svg>
                                            <span>View Public Site</span>
                                        </a>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2.5 cursor-pointer min-h-[44px]"
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
                <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-28 sm:pb-28 lg:pb-8">
                    {children}
                </main>

                {/* Mobile Bottom Navigation Bar (4 Main Tabs + 1 "More" Tab) */}
                <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around lg:hidden shadow-lg">
                    {/* 1. Dashboard */}
                    <Link
                        href="/admin/dashboard"
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-colors min-h-[44px] ${
                            isActive('/admin/dashboard')
                                ? 'text-[#00AEEF] font-bold'
                                : 'text-slate-400 hover:text-slate-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/admin/dashboard') ? "2.25" : "1.75"}>
                            <rect width="7" height="7" x="3" y="3" rx="1.5" />
                            <rect width="7" height="7" x="14" y="3" rx="1.5" />
                            <rect width="7" height="7" x="14" y="14" rx="1.5" />
                            <rect width="7" height="7" x="3" y="14" rx="1.5" />
                        </svg>
                        <span className="text-[10px] leading-tight tracking-tight">Dashboard</span>
                    </Link>

                    {/* 2. Bookings */}
                    <Link
                        href="/admin/bookings"
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-colors min-h-[44px] relative ${
                            isActive('/admin/bookings')
                                ? 'text-[#00AEEF] font-bold'
                                : 'text-slate-400 hover:text-slate-600 font-medium'
                        }`}
                    >
                        <div className="relative">
                            <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/admin/bookings') ? "2.25" : "1.75"}>
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            {pendingCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] leading-tight tracking-tight">Bookings</span>
                    </Link>

                    {/* 3. Master Data */}
                    <Link
                        href="/admin/master-data"
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-colors min-h-[44px] ${
                            isActive('/admin/master-data')
                                ? 'text-[#00AEEF] font-bold'
                                : 'text-slate-400 hover:text-slate-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/admin/master-data') ? "2.25" : "1.75"}>
                            <ellipse cx="12" cy="5" rx="9" ry="3" />
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
                        </svg>
                        <span className="text-[10px] leading-tight tracking-tight">Master</span>
                    </Link>

                    {/* 4. Calendar */}
                    <Link
                        href="/admin/calendar"
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-colors min-h-[44px] ${
                            isActive('/admin/calendar')
                                ? 'text-[#00AEEF] font-bold'
                                : 'text-slate-400 hover:text-slate-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isActive('/admin/calendar') ? "2.25" : "1.75"}>
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <line x1="16" x2="16" y1="2" y2="6" />
                            <line x1="8" x2="8" y1="2" y2="6" />
                            <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        <span className="text-[10px] leading-tight tracking-tight">Calendar</span>
                    </Link>

                    {/* 5. More (Bottom Sheet Trigger) */}
                    <button
                        type="button"
                        onClick={() => setMoreMenuOpen(true)}
                        className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-xl transition-colors min-h-[44px] cursor-pointer ${
                            isActive('/admin/financial-report') || isActive('/admin/website-content')
                                ? 'text-[#00AEEF] font-bold'
                                : 'text-slate-400 hover:text-slate-600 font-medium'
                        }`}
                    >
                        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="19" cy="12" r="1.5" />
                            <circle cx="5" cy="12" r="1.5" />
                        </svg>
                        <span className="text-[10px] leading-tight tracking-tight">More</span>
                    </button>
                </nav>
            </div>
        </div>
    );
}
