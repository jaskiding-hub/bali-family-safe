import React, { useState, useRef, useEffect, useCallback } from 'react';

function AccordionItem({ faq, isOpen, onToggle }) {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    const measure = useCallback(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, []);

    useEffect(() => {
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [measure]);

    return (
        <div
            className="transition-all duration-300"
            style={{
                borderRadius: '14px',
                border: isOpen ? '1.5px solid #00AEEF' : '1px solid #E1E3E4',
                background: '#FFFFFF',
                overflow: 'hidden',
                transition: 'border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isOpen ? '0px 8px 24px -4px rgba(0, 174, 239, 0.12)' : '0px 1px 3px rgba(0,0,0,0.04)',
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                className="hover:bg-slate-50/80 transition-colors duration-200"
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    lineHeight: '24px',
                    color: isOpen ? '#00658D' : '#191C1D',
                    transition: 'color 0.25s ease',
                }}
            >
                <span>{faq.q}</span>

                {/* Rotating plus/minus icon */}
                <div style={{
                    flexShrink: 0,
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOpen ? '#00AEEF' : '#94A3B8',
                    transition: 'color 0.25s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </svg>
                </div>
            </button>

            {/* Animated answer */}
            <div
                style={{
                    maxHeight: isOpen ? `${height + 40}px` : '0px',
                    opacity: isOpen ? 1 : 0,
                    transition: 'max-height 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden',
                }}
            >
                <div ref={contentRef} style={{ padding: '0 24px 20px' }}>
                    <div style={{
                        borderTop: '1px solid #E1E3E4',
                        paddingTop: '16px',
                    }}>
                        <p style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '15px',
                            lineHeight: '24px',
                            color: '#3E4850',
                            margin: 0,
                        }}>
                            {faq.a}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FaqSection({ faqs = [] }) {
    const [openIndex, setOpenIndex] = useState(-1);

    const displayFaqs = faqs && faqs.length > 0
        ? faqs.map((f) => ({
            q: f.question,
            a: f.answer,
        }))
        : [];

    return (
        <section
            id="faq"
            style={{
                background: '#FFFFFF',
                padding: '96px 40px',
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 64px',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '40px',
                        lineHeight: '48px',
                        color: '#191C1D',
                        margin: 0,
                        marginBottom: '16px',
                    }}>
                        Frequently Asked Questions
                    </h2>
                    <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '28px',
                        color: '#3E4850',
                        margin: 0,
                    }}>
                        Everything you need to know about our family transport and car seats
                    </p>
                </div>

                {/* FAQ Accordion */}
                {displayFaqs.length > 0 ? (
                    <div className="bfs-faq-list" style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {displayFaqs.map((faq, i) => (
                            <AccordionItem
                                key={i}
                                faq={faq}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: '#6E7881', fontSize: '14px' }}>
                        Belum ada pertanyaan umum (FAQ) saat ini.
                    </div>
                )}
            </div>
        </section>
    );
}
