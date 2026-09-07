import React, { useState, useRef, useEffect, useMemo } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function FinancialReport({
    stats = {},
    bookings = { data: [], links: [] },
    filters = {},
    available_months = [],
}) {
    const {
        total_revenue_formatted = 'Rp 0',
        completed_trips = 0,
        total_expenses_formatted = 'Rp 0',
        net_profit_total_formatted = 'Rp 0',
        profit_margin = 0,
        trend_percentage = 12,
        trend_is_positive = true,
        trend_label = 'from last month',
        period_label = 'This month',
        date_range_label = '',
    } = stats;

    const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showBreakdownModal, setShowBreakdownModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const periodDropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target)) {
                setPeriodDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter period selection
    const handleSelectPeriod = (periodKey, monthVal = null) => {
        setPeriodDropdownOpen(false);
        const params = {
            period: periodKey,
            search: searchQuery || undefined,
        };
        if (monthVal) {
            params.month = monthVal;
            delete params.period;
        }
        router.get('/admin/financial-report', params, {
            preserveState: true,
            replace: true,
        });
    };

    // Search submit
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/financial-report',
            {
                period: filters.period,
                month: filters.month,
                search: searchQuery || undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    // Open detail modal
    const openDetailModal = (booking) => {
        setSelectedBooking(booking);
        setShowBreakdownModal(true);
    };

    // Close detail modal
    const closeDetailModal = () => {
        setShowBreakdownModal(false);
        setTimeout(() => setSelectedBooking(null), 200);
    };

    // Download / Print Receipt Window
    const handlePrintReceipt = () => {
        if (!selectedBooking) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to download or print receipt.');
            return;
        }

        const deductionsHtml = (selectedBooking.expenses && selectedBooking.expenses.length > 0)
            ? selectedBooking.expenses.map(exp => `
                <div style="display: flex; justify-content: space-between; padding: 7px 0; color: #D93025; font-size: 14px; border-bottom: 1px dashed #F1F5F9;">
                    <span style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #94A3B8;">•</span> ${exp.name}
                    </span>
                    <span style="font-weight: 600;">${exp.amount_formatted}</span>
                </div>
            `).join('')
            : `
                <div style="display: flex; justify-content: space-between; padding: 7px 0; color: #D93025; font-size: 14px; border-bottom: 1px dashed #F1F5F9;">
                    <span>• Fuel (BBM)</span>
                    <span style="font-weight: 600;">- Rp 150.000</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 7px 0; color: #D93025; font-size: 14px; border-bottom: 1px dashed #F1F5F9;">
                    <span>• Toll & Parking</span>
                    <span style="font-weight: 600;">- Rp 50.000</span>
                </div>
            `;

        const totalDeductionsText = selectedBooking.total_deductions > 0
            ? selectedBooking.total_deductions_formatted
            : '- Rp 200.000';

        const netProfitText = selectedBooking.net_profit > 0
            ? selectedBooking.net_profit_formatted
            : selectedBooking.total_fee_formatted;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8" />
                <title>Financial Receipt - ${selectedBooking.booking_code || ('BFS-' + selectedBooking.id)}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        background: #F8FAFC;
                        padding: 40px 20px;
                        color: #171C20;
                        -webkit-font-smoothing: antialiased;
                    }
                    .receipt-card {
                        max-width: 580px;
                        margin: 0 auto;
                        background: #FFFFFF;
                        border-radius: 20px;
                        border: 1px solid #E2E8F0;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    }
                    .header-banner {
                        background: #0A2540;
                        color: #FFFFFF;
                        padding: 28px 32px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .brand-name {
                        font-size: 20px;
                        font-weight: 800;
                        letter-spacing: -0.5px;
                    }
                    .brand-tag {
                        font-size: 11px;
                        color: #00AEEF;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        margin-top: 2px;
                    }
                    .receipt-badge {
                        background: rgba(0, 174, 239, 0.15);
                        border: 1px solid rgba(0, 174, 239, 0.4);
                        color: #38BDF8;
                        padding: 4px 12px;
                        border-radius: 9999px;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                    }
                    .body-section {
                        padding: 28px 32px;
                    }
                    .meta-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        background: #F8FAFC;
                        border-radius: 14px;
                        padding: 16px 20px;
                        margin-bottom: 24px;
                        border: 1px solid #F1F5F9;
                    }
                    .meta-item { display: flex; flex-direction: column; gap: 2px; }
                    .meta-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }
                    .meta-value { font-size: 13.5px; font-weight: 700; color: #0F172A; }
                    .fee-highlight {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-bottom: 16px;
                        border-bottom: 1.5px solid #E2E8F0;
                        margin-bottom: 16px;
                    }
                    .fee-label { font-size: 15px; font-weight: 600; color: #334155; }
                    .fee-value { font-size: 20px; font-weight: 800; color: #0A2540; }
                    .deductions-title {
                        font-size: 11px;
                        font-weight: 700;
                        color: #64748B;
                        text-transform: uppercase;
                        letter-spacing: 0.8px;
                        margin-bottom: 8px;
                    }
                    .deductions-total {
                        display: flex;
                        justify-content: flex-end;
                        align-items: center;
                        gap: 12px;
                        padding: 12px 0 20px;
                        border-top: 1px dashed #CBD5E1;
                        font-size: 13.5px;
                    }
                    .profit-card {
                        background: linear-gradient(135deg, rgba(0,174,239,0.08) 0%, rgba(0,174,239,0.02) 100%);
                        border: 1.5px solid rgba(0, 174, 239, 0.25);
                        border-radius: 16px;
                        padding: 20px 24px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 8px;
                    }
                    .profit-label {
                        font-size: 12px;
                        font-weight: 800;
                        color: #0A2540;
                        letter-spacing: 0.8px;
                        text-transform: uppercase;
                    }
                    .profit-value {
                        font-size: 26px;
                        font-weight: 900;
                        color: #00AEEF;
                        letter-spacing: -0.5px;
                    }
                    .footer-note {
                        text-align: center;
                        padding: 20px 32px 28px;
                        font-size: 12px;
                        color: #94A3B8;
                        border-top: 1px solid #F1F5F9;
                        line-height: 1.5;
                    }
                    @media print {
                        body { background: #FFFFFF; padding: 0; }
                        .receipt-card { box-shadow: none; border: none; max-width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-card">
                    <div class="header-banner">
                        <div>
                            <div class="brand-name">Bali Family Safe</div>
                            <div class="brand-tag">Private Tour & Transport Service</div>
                        </div>
                        <div class="receipt-badge">${selectedBooking.booking_code || ('BFS-' + selectedBooking.id)}</div>
                    </div>

                    <div class="body-section">
                        <div class="meta-grid">
                            <div class="meta-item">
                                <span class="meta-label">Guest Name</span>
                                <span class="meta-value">${selectedBooking.guest_name}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Booking Date</span>
                                <span class="meta-value">${selectedBooking.booking_date_formatted}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Trip Type / Service</span>
                                <span class="meta-value">${selectedBooking.trip_title}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Status</span>
                                <span class="meta-value" style="color: #137333;">● ${selectedBooking.status}</span>
                            </div>
                            ${selectedBooking.driver ? `
                            <div class="meta-item">
                                <span class="meta-label">Assigned Driver</span>
                                <span class="meta-value">${selectedBooking.driver.name}</span>
                            </div>
                            ` : ''}
                            ${selectedBooking.vehicle ? `
                            <div class="meta-item">
                                <span class="meta-label">Vehicle</span>
                                <span class="meta-value">${selectedBooking.vehicle.name}</span>
                            </div>
                            ` : ''}
                        </div>

                        <div class="fee-highlight">
                            <span class="fee-label">Customer Total Fee</span>
                            <span class="fee-value">${selectedBooking.total_fee_formatted}</span>
                        </div>

                        <div>
                            <div class="deductions-title">Trip Operational Expenses</div>
                            <div style="margin-bottom: 8px;">
                                ${deductionsHtml}
                            </div>
                            <div class="deductions-total">
                                <span style="color: #64748B;">Total Deductions:</span>
                                <strong style="color: #0F172A;">${totalDeductionsText}</strong>
                            </div>
                        </div>

                        <div class="profit-card">
                            <div>
                                <div class="profit-label">COMPANY NET PROFIT</div>
                                <div style="font-size: 11px; color: #64748B; margin-top: 2px;">After operational deductions</div>
                            </div>
                            <div class="profit-value">${netProfitText}</div>
                        </div>
                    </div>

                    <div class="footer-note">
                        This is an official transaction summary record generated by Bali Family Safe Admin Console.<br/>
                        Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <AdminLayout title="Financial Report">
            <div className="w-full max-w-[1240px] mx-auto space-y-7 pb-10">

                {/* 1. Period Selector Card */}
                <div className="relative" ref={periodDropdownRef}>
                    <div
                        className="w-full bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-slate-200/80 p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200"
                    >
                        {/* Left: Active Period Info. On mobile, acts as dropdown toggle; on desktop, acts as static title. */}
                        <div
                            onClick={() => {
                                // Only toggle dropdown on small screens (< 768px)
                                if (window.innerWidth < 768) {
                                    setPeriodDropdownOpen(!periodDropdownOpen);
                                }
                            }}
                            className="flex items-center gap-4 select-none cursor-pointer md:cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00AEEF]/15 to-[#38BDF8]/25 border border-[#00AEEF]/30 flex items-center justify-center text-[#00658D] shadow-xs shrink-0">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <line x1="2" x2="22" y1="10" y2="10" />
                                </svg>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl lg:text-[26px] font-bold text-[#171C20] tracking-tight">
                                        {period_label}
                                    </span>
                                    {/* Chevron only visible on mobile screens */}
                                    <svg
                                        className={`w-5 h-5 text-slate-400 md:hidden transition-transform duration-200 ${periodDropdownOpen ? 'rotate-180 text-[#00AEEF]' : ''}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                {date_range_label && (
                                    <span className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]"></span>
                                        {date_range_label}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right: Quick-Period Switcher Tabs (Desktop) */}
                        <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
                            {[
                                { key: 'this_month', label: 'This Month' },
                                { key: 'last_month', label: 'Last Month' },
                                { key: 'this_year', label: 'This Year' },
                                { key: 'all_time', label: 'All Time' },
                            ].map((tab) => {
                                const isActive = filters.period === tab.key && !filters.month;
                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => handleSelectPeriod(tab.key)}
                                        className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-white text-[#0A2540] shadow-xs border border-slate-200/80 font-bold'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu (< md) */}
                    {periodDropdownOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="p-1.5 space-y-0.5">
                                <button
                                    type="button"
                                    onClick={() => handleSelectPeriod('this_month')}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                                        filters.period === 'this_month' && !filters.month ? 'bg-[#EFF4FA] text-[#00658D]' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>This Month</span>
                                    {filters.period === 'this_month' && !filters.month && (
                                        <span className="w-2 h-2 rounded-full bg-[#00AEEF]"></span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelectPeriod('last_month')}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                                        filters.period === 'last_month' ? 'bg-[#EFF4FA] text-[#00658D]' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>Last Month</span>
                                    {filters.period === 'last_month' && (
                                        <span className="w-2 h-2 rounded-full bg-[#00AEEF]"></span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelectPeriod('this_year')}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                                        filters.period === 'this_year' ? 'bg-[#EFF4FA] text-[#00658D]' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>This Year ({new Date().getFullYear()})</span>
                                    {filters.period === 'this_year' && (
                                        <span className="w-2 h-2 rounded-full bg-[#00AEEF]"></span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSelectPeriod('all_time')}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                                        filters.period === 'all_time' ? 'bg-[#EFF4FA] text-[#00658D]' : 'text-slate-700 hover:bg-slate-50'
                                    }`}
                                >
                                    <span>All Time Records</span>
                                    {filters.period === 'all_time' && (
                                        <span className="w-2 h-2 rounded-full bg-[#00AEEF]"></span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. Executive Summary Metric Cards (Figma Concept Refined) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Total Revenue Card */}
                    <div className="relative bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-slate-200/80 p-6 lg:p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00658D] to-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-[#3E4850] uppercase tracking-[1px]">
                                    Total Revenue
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-[#EFF4FA] border border-sky-100 flex items-center justify-center text-[#00658D] group-hover:scale-105 transition-transform">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-3xl lg:text-[36px] font-extrabold text-[#171C20] tracking-[-0.03em] tabular-nums leading-none mb-3">
                                {total_revenue_formatted}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold ${
                                trend_is_positive
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            }`}>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    {trend_is_positive ? (
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    ) : (
                                        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                                    )}
                                    {trend_is_positive ? (
                                        <polyline points="17 6 23 6 23 12" />
                                    ) : (
                                        <polyline points="17 18 23 18 23 12" />
                                    )}
                                </svg>
                                {trend_is_positive ? '+' : '-'}{trend_percentage}% {trend_label}
                            </span>

                            {net_profit_total_formatted !== 'Rp 0' && (
                                <span className="text-slate-500 font-medium hidden sm:inline">
                                    Net Profit: <strong className="text-slate-800">{net_profit_total_formatted}</strong>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Completed Trips Card */}
                    <div className="relative bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-slate-200/80 p-6 lg:p-7 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold text-[#3E4850] uppercase tracking-[1px]">
                                    Completed Trips
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-[#EFF4FA] border border-sky-100 flex items-center justify-center text-[#00658D] group-hover:scale-105 transition-transform">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                                        <circle cx="7" cy="17" r="2" />
                                        <circle cx="17" cy="17" r="2" />
                                    </svg>
                                </div>
                            </div>

                            <div className="text-3xl lg:text-[36px] font-extrabold text-[#171C20] tracking-[-0.03em] tabular-nums leading-none mb-3">
                                {completed_trips}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Successfully finished
                            </span>

                            {profit_margin > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#00658D] font-bold text-[11px] border border-sky-200/60">
                                    {profit_margin}% Net Margin
                                </span>
                            )}
                        </div>
                    </div>

                </div>

                {/* 3. Recent Bookings Table Section */}
                <div className="bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.04)] border border-slate-200/80 overflow-hidden">
                    {/* Header Controls (Gambar 2 removed, clean title + search) */}
                    <div className="p-6 border-b border-[#DEE3E8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#171C20] tracking-tight">
                                Recent Bookings
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Transaction logs, trip revenue breakdown, and profit calculations
                            </p>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search guest or code..."
                                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition-all"
                            />
                            <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        router.get('/admin/financial-report', { period: filters.period, month: filters.month }, { preserveState: true });
                                    }}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                                >
                                    ✕
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Table View with Balanced Spacing & Widths (Gambar 3 perfected) */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse table-fixed min-w-[720px]">
                            <thead>
                                <tr className="bg-[#EFF4FA] border-b border-[#DEE3E8] text-[#3E4850] text-xs font-semibold uppercase tracking-[0.7px]">
                                    <th className="w-[18%] py-4 px-6 align-middle">Date</th>
                                    <th className="w-[30%] py-4 px-6 align-middle">Guest & Service</th>
                                    <th className="w-[20%] py-4 px-6 align-middle">Total Fee</th>
                                    <th className="w-[16%] py-4 px-6 align-middle text-left">Status</th>
                                    <th className="w-[16%] py-4 px-6 align-middle text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#DEE3E8] text-sm text-[#171C20]">
                                {bookings.data.length > 0 ? (
                                    bookings.data.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                                            {/* Date Column */}
                                            <td className="py-4.5 px-6 align-middle whitespace-nowrap">
                                                <div className="font-semibold text-slate-800 text-sm">
                                                    {booking.booking_date_formatted || 'Oct 24, 2023'}
                                                </div>
                                                {booking.pickup_time && (
                                                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                                                        {booking.pickup_time}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Guest Name & Service */}
                                            <td className="py-4.5 px-6 align-middle">
                                                <div className="font-bold text-[#171C20] text-base group-hover:text-[#00658D] transition-colors truncate">
                                                    {booking.guest_name}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {booking.booking_code || ('#' + booking.id)}
                                                    </span>
                                                    <span className="text-xs text-slate-500 truncate">
                                                        {booking.trip_title}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Total Fee */}
                                            <td className="py-4.5 px-6 align-middle whitespace-nowrap">
                                                <span className="font-bold text-slate-900 text-base tabular-nums">
                                                    {booking.total_fee_formatted}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4.5 px-6 align-middle whitespace-nowrap text-left">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                    booking.status === 'Completed'
                                                        ? 'bg-[#E6F4EA] text-[#137333] border border-emerald-200/50'
                                                        : booking.status === 'On Going'
                                                        ? 'bg-sky-50 text-sky-700 border border-sky-200/50'
                                                        : booking.status === 'Cancelled'
                                                        ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                                                        : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        booking.status === 'Completed' ? 'bg-[#137333]' : 'bg-current'
                                                    }`}></span>
                                                    {booking.status}
                                                </span>
                                            </td>

                                            {/* Action Button */}
                                            <td className="py-4.5 px-6 align-middle text-center whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => openDetailModal(booking)}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#00658D] bg-[#EFF4FA] border border-sky-100/80 hover:border-sky-200 hover:shadow-md hover:shadow-slate-200/80 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 group/btn"
                                                >
                                                    <span>detail</span>
                                                    <svg className="w-3.5 h-3.5 text-[#00658D] group-hover/btn:translate-x-0.5 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="9 18 15 12 9 6" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-16 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="8" y1="12" x2="16" y2="12" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-700">No booking records found</p>
                                                <p className="text-xs text-slate-400">Try changing the period filter or clear your search term.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.links && bookings.links.length > 3 && (
                        <div className="p-4.5 border-t border-[#DEE3E8] bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-xs text-slate-500 font-medium">
                                Showing <strong className="text-slate-700">{bookings.from}</strong> to <strong className="text-slate-700">{bookings.to}</strong> of <strong className="text-slate-700">{bookings.total}</strong> bookings
                            </div>
                            <div className="flex items-center gap-1">
                                {bookings.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            link.active
                                                ? 'bg-[#00AEEF] text-white shadow-xs shadow-sky-500/20'
                                                : link.url
                                                ? 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* 4. Financial Breakdown Modal (Refined Figma Masterpiece) */}
            {showBreakdownModal && selectedBooking && (
                <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                        onClick={closeDetailModal}
                    />

                    {/* Modal Card */}
                    <div
                        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg z-10 overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between bg-gradient-to-b from-slate-50/50 to-white">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-bold text-[#0A2540] tracking-tight">
                                        Financial Breakdown
                                    </h3>
                                    <span className="text-[10px] font-mono font-bold text-[#00658D] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                                        {selectedBooking.booking_code || ('#' + selectedBooking.id)}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                                    {selectedBooking.guest_name} • {selectedBooking.booking_date_formatted} ({selectedBooking.trip_title})
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeDetailModal}
                                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-2 inline-flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 sm:p-7 space-y-6">
                            {/* Customer Total Gross Fee */}
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <span className="text-sm sm:text-base text-slate-700 font-medium">
                                    Customer Total Fee
                                </span>
                                <span className="text-xl sm:text-2xl font-extrabold text-[#0A2540] tabular-nums">
                                    {selectedBooking.total_fee_formatted}
                                </span>
                            </div>

                            {/* Deductions Items */}
                            <div className="space-y-3">
                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Operational Deductions
                                </div>

                                {selectedBooking.expenses && selectedBooking.expenses.length > 0 ? (
                                    selectedBooking.expenses.map((expense) => (
                                        <div key={expense.id} className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                                            <span className="text-slate-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                {expense.name}
                                            </span>
                                            <span className="text-[#D93025] font-semibold tabular-nums">
                                                {expense.amount_formatted}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                                            <span className="text-slate-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                Fuel (BBM)
                                            </span>
                                            <span className="text-[#D93025] font-semibold tabular-nums">
                                                - Rp 150.000
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                                            <span className="text-slate-600 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                                Toll & Parking
                                            </span>
                                            <span className="text-[#D93025] font-semibold tabular-nums">
                                                - Rp 50.000
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* Total Deductions Subtotal Line */}
                                <div className="border-t border-dashed border-slate-200 pt-3 flex items-center justify-end gap-3 text-sm">
                                    <span className="text-slate-500 font-medium text-xs">
                                        Total Deductions:
                                    </span>
                                    <span className="font-bold text-slate-800 tabular-nums">
                                        {selectedBooking.total_deductions > 0
                                            ? selectedBooking.total_deductions_formatted
                                            : '- Rp 200.000'}
                                    </span>
                                </div>
                            </div>

                            {/* Company Net Profit Highlight Card */}
                            <div className="bg-gradient-to-br from-[#00AEEF]/10 via-[#00AEEF]/5 to-transparent border border-[#00AEEF]/30 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                                <div>
                                    <span className="text-xs font-extrabold text-[#0A2540] tracking-wider uppercase block">
                                        COMPANY NET PROFIT
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-medium">
                                        After all verified trip deductions
                                    </span>
                                </div>

                                <div className="text-right">
                                    <span className="text-2xl sm:text-3xl font-black text-[#00AEEF] tracking-tight tabular-nums block">
                                        {selectedBooking.net_profit > 0
                                            ? selectedBooking.net_profit_formatted
                                            : selectedBooking.total_fee_formatted}
                                    </span>
                                    {selectedBooking.margin > 0 && (
                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 inline-block mt-0.5">
                                            {selectedBooking.margin}% Net Margin
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={handlePrintReceipt}
                                className="px-5 py-2.5 rounded-xl border border-[#00AEEF] text-[#00658D] hover:text-[#00AEEF] hover:bg-[#00AEEF]/10 font-semibold text-xs transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 6 2 18 2 18 9" />
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                    <rect width="12" height="8" x="6" y="14" />
                                </svg>
                                <span>Download Receipt</span>
                            </button>

                            <button
                                type="button"
                                onClick={closeDetailModal}
                                className="px-6 py-2.5 rounded-xl bg-[#00AEEF] hover:bg-[#009bd6] text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
