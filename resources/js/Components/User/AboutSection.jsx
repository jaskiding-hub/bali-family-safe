import React from 'react';

export default function AboutSection({ aboutContent = null }) {
    if (!aboutContent || !aboutContent.description) {
        return null;
    }

    const content = aboutContent;
    const paragraphs = (content.description || '').split('\n\n');

    return (
        <section
            id="about"
            className="w-full bg-white py-12 sm:py-16 lg:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden"
        >
            <div className="bfs-about-flex max-w-[1072px] mx-auto flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12">
                {/* Left: Photo */}
                <div
                    className="card-hover-fluid img-zoom w-full max-w-[512px] h-[260px] sm:h-[380px] lg:h-[500px] rounded-2xl lg:rounded-[20px] overflow-hidden shadow-[0px_10px_25px_-5px_rgba(0,76,107,0.12),0px_8px_10px_-6px_rgba(0,0,0,0.06)] shrink-0"
                >
                    <img
                        src={content.image_url || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'}
                        alt="Bali Family Safe Team and Vehicle"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Right: Content */}
                <div className="w-full max-w-[512px] flex flex-col">
                    {/* ABOUT US tag */}
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(0, 174, 239, 0.2)',
                            borderRadius: '9999px',
                            padding: '4px 16px',
                        }}>
                            <span style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '12px',
                                lineHeight: '16px',
                                letterSpacing: '0.6px',
                                textTransform: 'uppercase',
                                color: '#00658D',
                            }}>
                                ABOUT US
                            </span>
                        </div>
                    </div>

                    {/* H2 */}
                    <h2 className="font-['Inter'] font-bold text-2xl sm:text-3xl lg:text-[40px] lg:leading-[48px] text-[#191C1D] mb-4 sm:mb-6 max-w-[492px]">
                        {content.title}
                    </h2>

                    {/* Description paragraphs */}
                    <div className="flex flex-col gap-3.5 sm:gap-4 mb-4 sm:mb-6">
                        {paragraphs.map((para, i) => (
                            <p key={i} className="font-['Inter'] font-normal text-sm sm:text-base lg:text-[17px] lg:leading-[28px] text-[#3E4850] m-0">
                                {para}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
