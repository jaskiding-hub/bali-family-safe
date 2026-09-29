import React, { useState, useRef, useEffect } from 'react';
import { useForm, router, usePage, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Modal from '@/Components/Modal';

const inputBaseClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition";
const selectBaseClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2364748b%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.22%208.22a.75.75%200%200%201%201.06%200L10%2011.94l3.72-3.72a.75.75%200%201%201%201.06%201.06l-4.25%204.25a.75.75%200%200%201-1.06%200L5.22%209.28a.75.75%200%200%201%200-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10";

export default function WebsiteContent({
    stats = {},
    services = [],
    team_members = [],
    drivers = [],
    testimonials = [],
    gallery = [],
    faqs = [],
    site_features = [],
    site_settings = {},
    currentTab: initialTab = 'services',
}) {
    const { flash = {} } = usePage().props;
    const [activeTab, setActiveTab] = useState(initialTab || 'services');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, []);

    const switchTab = (tab) => {
        setActiveTab(tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url);
    };

    // =========================================================================
    // TAB 1: SERVICES
    // =========================================================================
    const [showAddServiceModal, setShowAddServiceModal] = useState(false);
    const [showEditServiceModal, setShowEditServiceModal] = useState(false);
    const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [addServicePhotoPreview, setAddServicePhotoPreview] = useState(null);
    const [editServicePhotoPreview, setEditServicePhotoPreview] = useState(null);
    const [serviceFeaturesList, setServiceFeaturesList] = useState(['']);

    const addServiceForm = useForm({
        name: '',
        category: '',
        short_description: '',
        long_description: '',
        icon: '',
        image: null,
        features: [],
    });

    const editServiceForm = useForm({
        _method: 'put',
        name: '',
        category: '',
        short_description: '',
        long_description: '',
        icon: '',
        image: null,
        features: [],
    });

    const handleAddServiceSubmit = (e) => {
        e.preventDefault();
        const featuresPayload = serviceFeaturesList
            .filter((f) => f.trim().length > 0)
            .map((f) => ({ feature_text: f.trim() }));
        addServiceForm.setData('features', featuresPayload);
        addServiceForm.post('/admin/services', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddServiceModal(false);
                addServiceForm.reset();
                setAddServicePhotoPreview(null);
                setServiceFeaturesList(['']);
            },
        });
    };

    const openEditServiceModal = (srv) => {
        setSelectedService(srv);
        const feats = (srv.features || []).map((f) => f.feature_text);
        setServiceFeaturesList(feats.length > 0 ? feats : ['']);
        editServiceForm.setData({
            _method: 'put',
            name: srv.name || '',
            category: srv.category || '',
            short_description: srv.short_description || '',
            long_description: srv.long_description || '',
            icon: srv.icon || '',
            image: null,
            features: (srv.features || []).map((f) => ({ feature_text: f.feature_text })),
        });
        setEditServicePhotoPreview(srv.image_url || null);
        setShowEditServiceModal(true);
    };

    const handleEditServiceSubmit = (e) => {
        e.preventDefault();
        if (!selectedService) return;
        const featuresPayload = serviceFeaturesList
            .filter((f) => f.trim().length > 0)
            .map((f) => ({ feature_text: f.trim() }));
        editServiceForm.setData('features', featuresPayload);
        editServiceForm.post(`/admin/services/${selectedService.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditServiceModal(false);
                editServiceForm.reset();
                setEditServicePhotoPreview(null);
                setSelectedService(null);
            },
        });
    };

    const handleDeleteService = () => {
        if (!selectedService) return;
        router.delete(`/admin/services/${selectedService.id}`, {
            onSuccess: () => {
                setShowDeleteServiceModal(false);
                setSelectedService(null);
            },
        });
    };

    // =========================================================================
    // TAB 2: TEAM MEMBERS
    // =========================================================================
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [showEditTeamModal, setShowEditTeamModal] = useState(false);
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [selectedTeamMember, setSelectedTeamMember] = useState(null);
    const [addTeamPhotoPreview, setAddTeamPhotoPreview] = useState(null);
    const [editTeamPhotoPreview, setEditTeamPhotoPreview] = useState(null);

    const addTeamForm = useForm({
        name: '',
        role_title: '',
        bio: '',
        photo: null,
        years_experience: '',
        languages: 'English, Indonesian',
        specialty_route: '',
        is_founder: false,
        driver_id: '',
    });

    const editTeamForm = useForm({
        _method: 'put',
        name: '',
        role_title: '',
        bio: '',
        photo: null,
        years_experience: '',
        languages: '',
        specialty_route: '',
        is_founder: false,
        driver_id: '',
    });

    const handleAddTeamSubmit = (e) => {
        e.preventDefault();
        addTeamForm.post('/admin/team-members', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddTeamModal(false);
                addTeamForm.reset();
                setAddTeamPhotoPreview(null);
            },
        });
    };

    const openEditTeamModal = (member) => {
        setSelectedTeamMember(member);
        editTeamForm.setData({
            _method: 'put',
            name: member.name || '',
            role_title: member.role_title || '',
            bio: member.bio || '',
            photo: null,
            years_experience: member.years_experience || '',
            languages: member.languages || '',
            specialty_route: member.specialty_route || '',
            is_founder: Boolean(member.is_founder),
            driver_id: member.driver_id || '',
        });
        setEditTeamPhotoPreview(member.photo_url || null);
        setShowEditTeamModal(true);
    };

    const handleEditTeamSubmit = (e) => {
        e.preventDefault();
        if (!selectedTeamMember) return;
        editTeamForm.post(`/admin/team-members/${selectedTeamMember.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditTeamModal(false);
                editTeamForm.reset();
                setEditTeamPhotoPreview(null);
                setSelectedTeamMember(null);
            },
        });
    };

    const handleDeleteTeam = () => {
        if (!selectedTeamMember) return;
        router.delete(`/admin/team-members/${selectedTeamMember.id}`, {
            onSuccess: () => {
                setShowDeleteTeamModal(false);
                setSelectedTeamMember(null);
            },
        });
    };

    // =========================================================================
    // TAB 3: TESTIMONIALS
    // =========================================================================
    const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
    const [showEditTestimonialModal, setShowEditTestimonialModal] = useState(false);
    const [showDeleteTestimonialModal, setShowDeleteTestimonialModal] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);

    const addTestimonialForm = useForm({
        customer_name: '',
        customer_origin: '',
        rating: 5,
        quote: '',
        is_approved: true,
    });

    const editTestimonialForm = useForm({
        customer_name: '',
        customer_origin: '',
        rating: 5,
        quote: '',
        is_approved: true,
    });

    const handleAddTestimonialSubmit = (e) => {
        e.preventDefault();
        addTestimonialForm.post('/admin/testimonials', {
            onSuccess: () => {
                setShowAddTestimonialModal(false);
                addTestimonialForm.reset();
            },
        });
    };

    const openEditTestimonialModal = (item) => {
        setSelectedTestimonial(item);
        editTestimonialForm.setData({
            customer_name: item.customer_name || '',
            customer_origin: item.customer_origin || '',
            rating: item.rating || 5,
            quote: item.quote || '',
            is_approved: Boolean(item.is_approved),
        });
        setShowEditTestimonialModal(true);
    };

    const handleEditTestimonialSubmit = (e) => {
        e.preventDefault();
        if (!selectedTestimonial) return;
        editTestimonialForm.put(`/admin/testimonials/${selectedTestimonial.id}`, {
            onSuccess: () => {
                setShowEditTestimonialModal(false);
                editTestimonialForm.reset();
                setSelectedTestimonial(null);
            },
        });
    };

    const handleDeleteTestimonial = () => {
        if (!selectedTestimonial) return;
        router.delete(`/admin/testimonials/${selectedTestimonial.id}`, {
            onSuccess: () => {
                setShowDeleteTestimonialModal(false);
                setSelectedTestimonial(null);
            },
        });
    };

    const handleToggleApproval = (testimonial) => {
        router.post(`/admin/testimonials/${testimonial.id}/toggle-approval`, {}, {
            preserveScroll: true,
        });
    };

    // =========================================================================
    // TAB 4: GALLERY
    // =========================================================================
    const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
    const [showEditGalleryModal, setShowEditGalleryModal] = useState(false);
    const [showDeleteGalleryModal, setShowDeleteGalleryModal] = useState(false);
    const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
    const [addGalleryPhotoPreview, setAddGalleryPhotoPreview] = useState(null);
    const [editGalleryPhotoPreview, setEditGalleryPhotoPreview] = useState(null);

    const addGalleryForm = useForm({
        image: null,
        caption: '',
        category: 'Fleet & Safety',
    });

    const editGalleryForm = useForm({
        _method: 'put',
        image: null,
        caption: '',
        category: '',
    });

    const handleAddGallerySubmit = (e) => {
        e.preventDefault();
        addGalleryForm.post('/admin/gallery', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddGalleryModal(false);
                addGalleryForm.reset();
                setAddGalleryPhotoPreview(null);
            },
        });
    };

    const openEditGalleryModal = (item) => {
        setSelectedGalleryItem(item);
        editGalleryForm.setData({
            _method: 'put',
            image: null,
            caption: item.caption || '',
            category: item.category || '',
        });
        setEditGalleryPhotoPreview(item.image_url || null);
        setShowEditGalleryModal(true);
    };

    const handleEditGallerySubmit = (e) => {
        e.preventDefault();
        if (!selectedGalleryItem) return;
        editGalleryForm.post(`/admin/gallery/${selectedGalleryItem.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditGalleryModal(false);
                editGalleryForm.reset();
                setEditGalleryPhotoPreview(null);
                setSelectedGalleryItem(null);
            },
        });
    };

    const handleDeleteGallery = () => {
        if (!selectedGalleryItem) return;
        router.delete(`/admin/gallery/${selectedGalleryItem.id}`, {
            onSuccess: () => {
                setShowDeleteGalleryModal(false);
                setSelectedGalleryItem(null);
            },
        });
    };

    // =========================================================================
    // TAB 5: FAQS
    // =========================================================================
    const [showAddFaqModal, setShowAddFaqModal] = useState(false);
    const [showEditFaqModal, setShowEditFaqModal] = useState(false);
    const [showDeleteFaqModal, setShowDeleteFaqModal] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);

    const addFaqForm = useForm({
        question: '',
        answer: '',
        display_order: 0,
    });

    const editFaqForm = useForm({
        question: '',
        answer: '',
        display_order: 0,
    });

    const handleAddFaqSubmit = (e) => {
        e.preventDefault();
        addFaqForm.post('/admin/faqs', {
            onSuccess: () => {
                setShowAddFaqModal(false);
                addFaqForm.reset();
            },
        });
    };

    const openEditFaqModal = (faq) => {
        setSelectedFaq(faq);
        editFaqForm.setData({
            question: faq.question || '',
            answer: faq.answer || '',
            display_order: faq.display_order ?? 0,
        });
        setShowEditFaqModal(true);
    };

    const handleEditFaqSubmit = (e) => {
        e.preventDefault();
        if (!selectedFaq) return;
        editFaqForm.put(`/admin/faqs/${selectedFaq.id}`, {
            onSuccess: () => {
                setShowEditFaqModal(false);
                editFaqForm.reset();
                setSelectedFaq(null);
            },
        });
    };

    const handleDeleteFaq = () => {
        if (!selectedFaq) return;
        router.delete(`/admin/faqs/${selectedFaq.id}`, {
            onSuccess: () => {
                setShowDeleteFaqModal(false);
                setSelectedFaq(null);
            },
        });
    };

    // =========================================================================
    // TAB 6: SITE FEATURES (WHY US)
    // =========================================================================
    const [showAddFeatureModal, setShowAddFeatureModal] = useState(false);
    const [showEditFeatureModal, setShowEditFeatureModal] = useState(false);
    const [showDeleteFeatureModal, setShowDeleteFeatureModal] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);

    const addFeatureForm = useForm({
        title: '',
        description: '',
        icon: 'ShieldCheck',
        section: 'why_us',
        display_order: 0,
    });

    const editFeatureForm = useForm({
        title: '',
        description: '',
        icon: '',
        section: 'why_us',
        display_order: 0,
    });

    const handleAddFeatureSubmit = (e) => {
        e.preventDefault();
        addFeatureForm.post('/admin/site-features', {
            onSuccess: () => {
                setShowAddFeatureModal(false);
                addFeatureForm.reset();
            },
        });
    };

    const openEditFeatureModal = (feature) => {
        setSelectedFeature(feature);
        editFeatureForm.setData({
            title: feature.title || '',
            description: feature.description || '',
            icon: feature.icon || '',
            section: feature.section || 'why_us',
            display_order: feature.display_order ?? 0,
        });
        setShowEditFeatureModal(true);
    };

    const handleEditFeatureSubmit = (e) => {
        e.preventDefault();
        if (!selectedFeature) return;
        editFeatureForm.put(`/admin/site-features/${selectedFeature.id}`, {
            onSuccess: () => {
                setShowEditFeatureModal(false);
                editFeatureForm.reset();
                setSelectedFeature(null);
            },
        });
    };

    const handleDeleteFeature = () => {
        if (!selectedFeature) return;
        router.delete(`/admin/site-features/${selectedFeature.id}`, {
            onSuccess: () => {
                setShowDeleteFeatureModal(false);
                setSelectedFeature(null);
            },
        });
    };

    // =========================================================================
    // TAB 7: SITE SETTINGS
    // =========================================================================
    const [settingsHeroPreview, setSettingsHeroPreview] = useState(site_settings.hero_background_image || null);
    const settingsForm = useForm({
        _method: 'put',
        hero_headline: site_settings.hero_headline || '',
        hero_subheadline: site_settings.hero_subheadline || '',
        hero_background_image: null,
        email: site_settings.email || '',
        whatsapp_number: site_settings.whatsapp_number || '',
        instagram_url: site_settings.instagram_url || '',
        facebook_url: site_settings.facebook_url || '',
        google_maps_embed: site_settings.google_maps_embed || '',
    });

    const handleSettingsSubmit = (e) => {
        e.preventDefault();
        settingsForm.post('/admin/site-settings', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Keep updated preview
            },
        });
    };

    return (
        <AdminLayout title="Website Content CMS">
            <Head title="Website Content CMS" />
            <div className="space-y-6 max-w-[1320px] pb-16">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-200 shadow-xs">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-200 shadow-xs">
                        <svg className="w-5 h-5 text-rose-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Header & Tabs */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#00AEEF] bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                                    CMS Module
                                </span>
                                <span className="text-xs font-medium text-slate-400">&bull;</span>
                                <span className="text-xs font-medium text-slate-500">Website Content</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                                Website Content Management
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                Kelola layanan, profil tim supir & staf, ulasan pelanggan, galeri, FAQ, fitur keunggulan, dan profil kontak website.
                            </p>
                        </div>
                    </div>

                    {/* CMS Navigation Tabs */}
                    <div className="flex items-center gap-2 pt-4 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'services', label: 'Services', count: services.length },
                            { id: 'team', label: 'Our Team', count: team_members.length },
                            { id: 'testimonials', label: 'Testimonials', count: testimonials.length },
                            { id: 'gallery', label: 'Gallery', count: gallery.length },
                            { id: 'faqs', label: 'FAQs', count: faqs.length },
                            { id: 'site_features', label: 'Why Choose Us', count: site_features.length },
                            { id: 'settings', label: 'Site Settings', count: null },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => switchTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                                    activeTab === tab.id
                                        ? 'bg-slate-900 text-white shadow-xs'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <span>{tab.label}</span>
                                {tab.count !== null && (
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                            activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* TAB 1: SERVICES CONTENT */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'services' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Daftar Layanan Transportasi</h3>
                                <p className="text-xs text-slate-500">Kelola kategori layanan & fitur unggulan yang ditawarkan.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setServiceFeaturesList(['']);
                                    setAddServicePhotoPreview(null);
                                    addServiceForm.reset();
                                    setShowAddServiceModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Layanan</span>
                            </button>
                        </div>

                        {services.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                Belum ada data layanan. Klik "Tambah Layanan" untuk mulai membuat.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-xl">Layanan</th>
                                            <th className="px-4 py-3">Kategori</th>
                                            <th className="px-4 py-3">Deskripsi</th>
                                            <th className="px-4 py-3">Fitur Termasuk</th>
                                            <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {services.map((srv) => (
                                            <tr key={srv.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-4 py-3.5 font-medium text-slate-900 flex items-center gap-3">
                                                    {srv.image_url ? (
                                                        <img src={srv.image_url} alt={srv.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#00AEEF] flex items-center justify-center font-bold text-xs">
                                                            {srv.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-slate-900">{srv.name}</div>
                                                        <div className="text-xs text-slate-400">{srv.slug}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                                                        {srv.category || 'Umum'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 max-w-xs text-xs text-slate-500 truncate">
                                                    {srv.short_description || '-'}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-wrap gap-1 max-w-xs">
                                                        {(srv.features || []).slice(0, 3).map((f) => (
                                                            <span key={f.id} className="px-2 py-0.5 bg-sky-50 text-[#00AEEF] text-[11px] rounded-md font-medium">
                                                                {f.feature_text}
                                                            </span>
                                                        ))}
                                                        {(srv.features || []).length > 3 && (
                                                            <span className="text-[11px] text-slate-400 font-semibold">
                                                                +{srv.features.length - 3} lainnya
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditServiceModal(srv)}
                                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedService(srv);
                                                                setShowDeleteServiceModal(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 2: TEAM MEMBERS CONTENT */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'team' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Daftar Anggota Tim & Driver</h3>
                                <p className="text-xs text-slate-500">Kelola profil pemandu, driver keluarga, dan staf operasional.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setAddTeamPhotoPreview(null);
                                    addTeamForm.reset();
                                    setShowAddTeamModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Anggota Tim</span>
                            </button>
                        </div>

                        {team_members.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                Belum ada anggota tim. Klik "Tambah Anggota Tim" untuk menambahkan profil.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-xl">Anggota</th>
                                            <th className="px-4 py-3">Peran / Jabatan</th>
                                            <th className="px-4 py-3">Pengalaman & Bahasa</th>
                                            <th className="px-4 py-3">Tautan Driver</th>
                                            <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {team_members.map((member) => (
                                            <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-4 py-3.5 font-medium text-slate-900 flex items-center gap-3">
                                                    {member.photo_url ? (
                                                        <img src={member.photo_url} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                                                            {member.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                                            <span>{member.name}</span>
                                                            {Boolean(member.is_founder) && (
                                                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-[10px] font-bold">
                                                                    Founder
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{member.specialty_route || 'All Bali Routes'}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <span className="inline-block px-2.5 py-1 bg-sky-50 text-[#00AEEF] rounded-lg text-xs font-semibold">
                                                        {member.role_title}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-xs text-slate-600">
                                                    <div>{member.years_experience || '-'} pengalaman</div>
                                                    <div className="text-slate-400 text-[11px]">{member.languages || 'English'}</div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    {member.driver ? (
                                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                            <span>{member.driver.name}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditTeamModal(member)}
                                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedTeamMember(member);
                                                                setShowDeleteTeamModal(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 3: TESTIMONIALS CONTENT */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'testimonials' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Ulasan & Testimoni Wisatawan</h3>
                                <p className="text-xs text-slate-500">Moderasi testimoni pengunjung yang tampil di halaman beranda.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    addTestimonialForm.reset();
                                    setShowAddTestimonialModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Testimoni</span>
                            </button>
                        </div>

                        {testimonials.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                Belum ada testimoni. Klik "Tambah Testimoni" untuk menambahkan ulasan.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-700">
                                    <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-xl">Pelanggan</th>
                                            <th className="px-4 py-3">Rating</th>
                                            <th className="px-4 py-3">Kutipan Review</th>
                                            <th className="px-4 py-3">Status Tampil</th>
                                            <th className="px-4 py-3 text-right rounded-r-xl">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {testimonials.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                                <td className="px-4 py-3.5">
                                                    <div className="font-bold text-slate-900">{item.customer_name}</div>
                                                    <div className="text-xs text-slate-400">{item.customer_origin || 'Tourist'}</div>
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-1 text-amber-500">
                                                        {[...Array(item.rating || 5)].map((_, i) => (
                                                            <svg key={i} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
                                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 max-w-sm text-xs text-slate-600 italic">
                                                    "{item.quote}"
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleApproval(item)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                                                            item.is_approved
                                                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                                                        }`}
                                                    >
                                                        <span className={`w-2 h-2 rounded-full ${item.is_approved ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                                        <span>{item.is_approved ? 'Disetujui' : 'Tersembunyi'}</span>
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditTestimonialModal(item)}
                                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedTestimonial(item);
                                                                setShowDeleteTestimonialModal(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 4: GALLERY CONTENT */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'gallery' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Galeri Foto & Dokumentasi</h3>
                                <p className="text-xs text-slate-500">Unggah dokumentasi armada, fasilitas child seat, dan momen wisata keluarga.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setAddGalleryPhotoPreview(null);
                                    addGalleryForm.reset();
                                    setShowAddGalleryModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Unggah Foto Galeri</span>
                            </button>
                        </div>

                        {gallery.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                Belum ada foto di galeri. Klik tombol di atas untuk mengunggah foto.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {gallery.map((item) => (
                                    <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex flex-col">
                                        <div className="aspect-4/3 overflow-hidden bg-slate-100">
                                            <img
                                                src={item.image_url}
                                                alt={item.caption || 'Foto Galeri'}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00AEEF] bg-sky-50 px-2 py-0.5 rounded-md inline-block mb-1">
                                                    {item.category || 'General'}
                                                </span>
                                                <p className="text-xs text-slate-700 font-medium line-clamp-2">
                                                    {item.caption || 'Tanpa keterangan'}
                                                </p>
                                            </div>
                                            <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditGalleryModal(item)}
                                                    className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedGalleryItem(item);
                                                        setShowDeleteGalleryModal(true);
                                                    }}
                                                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 5: FAQS CONTENT */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'faqs' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions (FAQ)</h3>
                                <p className="text-xs text-slate-500">Pertanyaan umum dan jawaban untuk membantu calon penyewa.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    addFaqForm.reset();
                                    setShowAddFaqModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah FAQ</span>
                            </button>
                        </div>

                        {faqs.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                Belum ada FAQ. Klik "Tambah FAQ" untuk menambahkan pertanyaan baru.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {faqs.map((faq, idx) => (
                                    <div key={faq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-sky-100 text-[#00AEEF] text-[11px] font-bold flex items-center justify-center shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-sm">{faq.question}</h4>
                                            </div>
                                            <p className="text-xs text-slate-600 pl-7 whitespace-pre-line leading-relaxed">{faq.answer}</p>
                                        </div>
                                        <div className="inline-flex items-center gap-2 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => openEditFaqModal(faq)}
                                                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFaq(faq);
                                                    setShowDeleteFaqModal(true);
                                                }}
                                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 6: SITE FEATURES (WHY CHOOSE US) */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'site_features' && (
                    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Fitur & Keunggulan Layanan (Why Choose Us)</h3>
                                <p className="text-xs text-slate-500">Poin pembeda keselamatan dan kenyamanan transportasi keluarga.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    addFeatureForm.reset();
                                    setShowAddFeatureModal(true);
                                }}
                                className="inline-flex items-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Keunggulan</span>
                            </button>
                        </div>

                        {site_features.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">
                                Belum ada poin keunggulan. Klik tombol di atas untuk menambah.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {site_features.map((feat) => (
                                    <div key={feat.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="w-8 h-8 rounded-xl bg-sky-50 text-[#00AEEF] flex items-center justify-center font-bold text-xs border border-sky-100">
                                                    ★
                                                </span>
                                                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                    Order #{feat.display_order}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-sm">{feat.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.description || '-'}</p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditFeatureModal(feat)}
                                                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedFeature(feat);
                                                    setShowDeleteFeatureModal(true);
                                                }}
                                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* TAB 7: SITE SETTINGS */}
                {/* ----------------------------------------------------------------- */}
                {activeTab === 'settings' && (
                    <form onSubmit={handleSettingsSubmit} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 p-5 sm:p-7 space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-base font-bold text-slate-900">Pengaturan Utama Website</h3>
                            <p className="text-xs text-slate-500">Konfigurasi teks hero banner, kontak darurat, WhatsApp, dan tautan sosial media.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Headline */}
                            <div className="md:col-span-2 space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Hero Headline
                                </label>
                                <input
                                    type="text"
                                    value={settingsForm.data.hero_headline}
                                    onChange={(e) => settingsForm.setData('hero_headline', e.target.value)}
                                    placeholder="Safe & Comfortable Family Travel in Bali"
                                    className={inputBaseClass}
                                />
                                {settingsForm.errors.hero_headline && (
                                    <p className="text-xs text-rose-500">{settingsForm.errors.hero_headline}</p>
                                )}
                            </div>

                            {/* Subheadline */}
                            <div className="md:col-span-2 space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Hero Subheadline
                                </label>
                                <textarea
                                    rows="2"
                                    value={settingsForm.data.hero_subheadline}
                                    onChange={(e) => settingsForm.setData('hero_subheadline', e.target.value)}
                                    placeholder="Equipped with certified child safety seats, patient and experienced family drivers."
                                    className={inputBaseClass}
                                />
                                {settingsForm.errors.hero_subheadline && (
                                    <p className="text-xs text-rose-500">{settingsForm.errors.hero_subheadline}</p>
                                )}
                            </div>

                            {/* Hero Background Image */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Background Hero Image
                                </label>
                                {settingsHeroPreview && (
                                    <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                                        <img src={settingsHeroPreview} alt="Hero Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            settingsForm.setData('hero_background_image', file);
                                            setSettingsHeroPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF] hover:file:bg-sky-100 cursor-pointer"
                                />
                            </div>

                            {/* WhatsApp Number */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Nomor WhatsApp (dengan kode negara)
                                </label>
                                <input
                                    type="text"
                                    value={settingsForm.data.whatsapp_number}
                                    onChange={(e) => settingsForm.setData('whatsapp_number', e.target.value)}
                                    placeholder="+62 812 3456 7890"
                                    className={inputBaseClass}
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Email Resmi
                                </label>
                                <input
                                    type="email"
                                    value={settingsForm.data.email}
                                    onChange={(e) => settingsForm.setData('email', e.target.value)}
                                    placeholder="contact@balifamilysafe.com"
                                    className={inputBaseClass}
                                />
                            </div>

                            {/* Instagram */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Instagram URL
                                </label>
                                <input
                                    type="url"
                                    value={settingsForm.data.instagram_url}
                                    onChange={(e) => settingsForm.setData('instagram_url', e.target.value)}
                                    placeholder="https://instagram.com/balifamilysafe"
                                    className={inputBaseClass}
                                />
                            </div>

                            {/* Facebook */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Facebook URL
                                </label>
                                <input
                                    type="url"
                                    value={settingsForm.data.facebook_url}
                                    onChange={(e) => settingsForm.setData('facebook_url', e.target.value)}
                                    placeholder="https://facebook.com/balifamilysafe"
                                    className={inputBaseClass}
                                />
                            </div>

                            {/* Google Maps Embed */}
                            <div className="md:col-span-2 space-y-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Google Maps Embed Code / Link
                                </label>
                                <textarea
                                    rows="2"
                                    value={settingsForm.data.google_maps_embed}
                                    onChange={(e) => settingsForm.setData('google_maps_embed', e.target.value)}
                                    placeholder="https://www.google.com/maps/embed?..."
                                    className={inputBaseClass}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={settingsForm.processing}
                                className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {settingsForm.processing ? 'Menyimpan...' : 'Simpan Perubahan Pengaturan'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* ================================================================= */}
            {/* SERVICE MODALS */}
            {/* ================================================================= */}
            {/* Add Service Modal */}
            <Modal
                show={showAddServiceModal}
                onClose={() => setShowAddServiceModal(false)}
                title="Tambah Layanan Baru"
                maxWidth="xl"
            >
                <form onSubmit={handleAddServiceSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Layanan <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={addServiceForm.data.name}
                            onChange={(e) => addServiceForm.setData('name', e.target.value)}
                            placeholder="e.g. Airport Transfer Family"
                            className={inputBaseClass}
                        />
                        {addServiceForm.errors.name && <p className="text-xs text-rose-500 mt-1">{addServiceForm.errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                            <input
                                type="text"
                                value={addServiceForm.data.category}
                                onChange={(e) => addServiceForm.setData('category', e.target.value)}
                                placeholder="e.g. Airport, Day Tour"
                                className={inputBaseClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Icon Name</label>
                            <input
                                type="text"
                                value={addServiceForm.data.icon}
                                onChange={(e) => addServiceForm.setData('icon', e.target.value)}
                                placeholder="e.g. Car, Airplane"
                                className={inputBaseClass}
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Nama icon dari Phosphor Icons (cari di phosphoricons.com)</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                            rows="2"
                            value={addServiceForm.data.short_description}
                            onChange={(e) => addServiceForm.setData('short_description', e.target.value)}
                            placeholder="Ringkasan layanan untuk kartu di beranda"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto Layanan</label>
                        {addServicePhotoPreview && (
                            <img src={addServicePhotoPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover mb-2 border border-slate-200" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    addServiceForm.setData('image', file);
                                    setAddServicePhotoPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF]"
                        />
                    </div>

                    {/* Dynamic features */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-slate-700">Fitur Termasuk (Bullet Points)</label>
                            <button
                                type="button"
                                onClick={() => setServiceFeaturesList([...serviceFeaturesList, ''])}
                                className="text-xs font-bold text-[#00AEEF] hover:underline"
                            >
                                + Tambah Fitur
                            </button>
                        </div>
                        <div className="space-y-2">
                            {serviceFeaturesList.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => {
                                            const updated = [...serviceFeaturesList];
                                            updated[idx] = e.target.value;
                                            setServiceFeaturesList(updated);
                                        }}
                                        placeholder="e.g. Free Child Seat, Bottled Water"
                                        className={inputBaseClass}
                                    />
                                    {serviceFeaturesList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = serviceFeaturesList.filter((_, i) => i !== idx);
                                                setServiceFeaturesList(updated);
                                            }}
                                            className="text-rose-500 hover:text-rose-700 p-2"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddServiceModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={addServiceForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {addServiceForm.processing ? 'Menyimpan...' : 'Simpan Layanan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Service Modal */}
            <Modal
                show={showEditServiceModal}
                onClose={() => setShowEditServiceModal(false)}
                title="Edit Layanan"
                maxWidth="xl"
            >
                <form onSubmit={handleEditServiceSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Layanan <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={editServiceForm.data.name}
                            onChange={(e) => editServiceForm.setData('name', e.target.value)}
                            className={inputBaseClass}
                        />
                        {editServiceForm.errors.name && <p className="text-xs text-rose-500 mt-1">{editServiceForm.errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                            <input
                                type="text"
                                value={editServiceForm.data.category}
                                onChange={(e) => editServiceForm.setData('category', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Icon Name</label>
                            <input
                                type="text"
                                value={editServiceForm.data.icon}
                                onChange={(e) => editServiceForm.setData('icon', e.target.value)}
                                className={inputBaseClass}
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Nama icon dari Phosphor Icons (cari di phosphoricons.com)</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                            rows="2"
                            value={editServiceForm.data.short_description}
                            onChange={(e) => editServiceForm.setData('short_description', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ganti Foto Layanan (Opsional)</label>
                        {editServicePhotoPreview && (
                            <img src={editServicePhotoPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover mb-2 border border-slate-200" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    editServiceForm.setData('image', file);
                                    setEditServicePhotoPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF]"
                        />
                    </div>

                    {/* Dynamic features */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-slate-700">Fitur Termasuk (Bullet Points)</label>
                            <button
                                type="button"
                                onClick={() => setServiceFeaturesList([...serviceFeaturesList, ''])}
                                className="text-xs font-bold text-[#00AEEF] hover:underline"
                            >
                                + Tambah Fitur
                            </button>
                        </div>
                        <div className="space-y-2">
                            {serviceFeaturesList.map((feat, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={feat}
                                        onChange={(e) => {
                                            const updated = [...serviceFeaturesList];
                                            updated[idx] = e.target.value;
                                            setServiceFeaturesList(updated);
                                        }}
                                        className={inputBaseClass}
                                    />
                                    {serviceFeaturesList.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = serviceFeaturesList.filter((_, i) => i !== idx);
                                                setServiceFeaturesList(updated);
                                            }}
                                            className="text-rose-500 hover:text-rose-700 p-2"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditServiceModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editServiceForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {editServiceForm.processing ? 'Menyimpan...' : 'Perbarui Layanan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Service Modal */}
            <Modal
                show={showDeleteServiceModal}
                onClose={() => setShowDeleteServiceModal(false)}
                title="Hapus Layanan"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus layanan <strong>{selectedService?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteServiceModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteService}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ================================================================= */}
            {/* TEAM MODALS */}
            {/* ================================================================= */}
            {/* Add Team Modal */}
            <Modal
                show={showAddTeamModal}
                onClose={() => setShowAddTeamModal(false)}
                title="Tambah Anggota Tim / Driver"
                maxWidth="lg"
            >
                <form onSubmit={handleAddTeamSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={addTeamForm.data.name}
                                onChange={(e) => addTeamForm.setData('name', e.target.value)}
                                placeholder="e.g. Wayan Sudira"
                                className={inputBaseClass}
                            />
                            {addTeamForm.errors.name && <p className="text-xs text-rose-500 mt-1">{addTeamForm.errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Role <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={addTeamForm.data.role_title}
                                onChange={(e) => addTeamForm.setData('role_title', e.target.value)}
                                placeholder="e.g. Senior Family Driver"
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pengalaman</label>
                        <input
                            type="text"
                            value={addTeamForm.data.years_experience}
                            onChange={(e) => addTeamForm.setData('years_experience', e.target.value)}
                            placeholder="e.g. 7+ Years"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Bahasa</label>
                        <input
                            type="text"
                            value={addTeamForm.data.languages}
                            onChange={(e) => addTeamForm.setData('languages', e.target.value)}
                            placeholder="English, Indonesian"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto Profil</label>
                        {addTeamPhotoPreview && (
                            <img src={addTeamPhotoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover mb-2 border border-slate-200" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    addTeamForm.setData('photo', file);
                                    setAddTeamPhotoPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="add_is_founder"
                            checked={addTeamForm.data.is_founder}
                            onChange={(e) => addTeamForm.setData('is_founder', e.target.checked)}
                            className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                        />
                        <label htmlFor="add_is_founder" className="text-xs font-bold text-slate-700 cursor-pointer">
                            Tandai sebagai Founder / Co-Founder
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddTeamModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={addTeamForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {addTeamForm.processing ? 'Menyimpan...' : 'Simpan Anggota'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Team Modal */}
            <Modal
                show={showEditTeamModal}
                onClose={() => setShowEditTeamModal(false)}
                title="Edit Profil Anggota Tim"
                maxWidth="lg"
            >
                <form onSubmit={handleEditTeamSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={editTeamForm.data.name}
                                onChange={(e) => editTeamForm.setData('name', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Role <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={editTeamForm.data.role_title}
                                onChange={(e) => editTeamForm.setData('role_title', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tautkan ke Driver</label>
                            <select
                                value={editTeamForm.data.driver_id}
                                onChange={(e) => editTeamForm.setData('driver_id', e.target.value)}
                                className={selectBaseClass}
                            >
                                <option value="">-- Bukan Driver / Staf Umum --</option>
                                {drivers.map((drv) => (
                                    <option key={drv.id} value={drv.id}>
                                        {drv.full_name || drv.name} {drv.whatsapp_number || drv.phone ? `(${drv.whatsapp_number || drv.phone})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Pengalaman</label>
                            <input
                                type="text"
                                value={editTeamForm.data.years_experience}
                                onChange={(e) => editTeamForm.setData('years_experience', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Bahasa</label>
                            <input
                                type="text"
                                value={editTeamForm.data.languages}
                                onChange={(e) => editTeamForm.setData('languages', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ganti Foto Profil (Opsional)</label>
                        {editTeamPhotoPreview && (
                            <img src={editTeamPhotoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover mb-2 border border-slate-200" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    editTeamForm.setData('photo', file);
                                    setEditTeamPhotoPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF]"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit_is_founder"
                            checked={editTeamForm.data.is_founder}
                            onChange={(e) => editTeamForm.setData('is_founder', e.target.checked)}
                            className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                        />
                        <label htmlFor="edit_is_founder" className="text-xs font-bold text-slate-700 cursor-pointer">
                            Tandai sebagai Founder / Co-Founder
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditTeamModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editTeamForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {editTeamForm.processing ? 'Menyimpan...' : 'Perbarui Profil'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Team Modal */}
            <Modal
                show={showDeleteTeamModal}
                onClose={() => setShowDeleteTeamModal(false)}
                title="Hapus Anggota Tim"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus profil <strong>{selectedTeamMember?.name}</strong>?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteTeamModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteTeam}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ================================================================= */}
            {/* TESTIMONIAL MODALS */}
            {/* ================================================================= */}
            {/* Add Testimonial Modal */}
            <Modal
                show={showAddTestimonialModal}
                onClose={() => setShowAddTestimonialModal(false)}
                title="Tambah Testimoni Baru"
                maxWidth="md"
            >
                <form onSubmit={handleAddTestimonialSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tamu / Pelanggan <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={addTestimonialForm.data.customer_name}
                            onChange={(e) => addTestimonialForm.setData('customer_name', e.target.value)}
                            placeholder="e.g. Sarah & Family"
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Asal Wisatawan</label>
                            <input
                                type="text"
                                value={addTestimonialForm.data.customer_origin}
                                onChange={(e) => addTestimonialForm.setData('customer_origin', e.target.value)}
                                placeholder="e.g. Melbourne, Australia"
                                className={inputBaseClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Rating Bintang</label>
                            <select
                                value={addTestimonialForm.data.rating}
                                onChange={(e) => addTestimonialForm.setData('rating', parseInt(e.target.value, 10))}
                                className={selectBaseClass}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                                <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                                <option value="3">⭐⭐⭐ (3 Bintang)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan / Testimoni <span className="text-red-500">*</span></label>
                        <textarea
                            rows="3"
                            required
                            value={addTestimonialForm.data.quote}
                            onChange={(e) => addTestimonialForm.setData('quote', e.target.value)}
                            placeholder="Pengalaman selama menggunakan layanan Bali Family Safe..."
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="add_is_approved"
                            checked={addTestimonialForm.data.is_approved}
                            onChange={(e) => addTestimonialForm.setData('is_approved', e.target.checked)}
                            className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                        />
                        <label htmlFor="add_is_approved" className="text-xs font-bold text-slate-700 cursor-pointer">
                            Langsung tampilkan di website (Disetujui)
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddTestimonialModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={addTestimonialForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {addTestimonialForm.processing ? 'Menyimpan...' : 'Simpan Testimoni'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Testimonial Modal */}
            <Modal
                show={showEditTestimonialModal}
                onClose={() => setShowEditTestimonialModal(false)}
                title="Edit Testimoni"
                maxWidth="md"
            >
                <form onSubmit={handleEditTestimonialSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tamu <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={editTestimonialForm.data.customer_name}
                            onChange={(e) => editTestimonialForm.setData('customer_name', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Asal Wisatawan</label>
                            <input
                                type="text"
                                value={editTestimonialForm.data.customer_origin}
                                onChange={(e) => editTestimonialForm.setData('customer_origin', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Rating</label>
                            <select
                                value={editTestimonialForm.data.rating}
                                onChange={(e) => editTestimonialForm.setData('rating', parseInt(e.target.value, 10))}
                                className={selectBaseClass}
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5 Bintang)</option>
                                <option value="4">⭐⭐⭐⭐ (4 Bintang)</option>
                                <option value="3">⭐⭐⭐ (3 Bintang)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ulasan <span className="text-red-500">*</span></label>
                        <textarea
                            rows="3"
                            required
                            value={editTestimonialForm.data.quote}
                            onChange={(e) => editTestimonialForm.setData('quote', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit_is_approved"
                            checked={editTestimonialForm.data.is_approved}
                            onChange={(e) => editTestimonialForm.setData('is_approved', e.target.checked)}
                            className="w-4 h-4 rounded text-[#00AEEF] focus:ring-[#00AEEF]"
                        />
                        <label htmlFor="edit_is_approved" className="text-xs font-bold text-slate-700 cursor-pointer">
                            Disetujui untuk ditampilkan
                        </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditTestimonialModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editTestimonialForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {editTestimonialForm.processing ? 'Menyimpan...' : 'Perbarui Testimoni'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Testimonial Modal */}
            <Modal
                show={showDeleteTestimonialModal}
                onClose={() => setShowDeleteTestimonialModal(false)}
                title="Hapus Testimoni"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus testimoni dari <strong>{selectedTestimonial?.customer_name}</strong>?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteTestimonialModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteTestimonial}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ================================================================= */}
            {/* GALLERY MODALS */}
            {/* ================================================================= */}
            {/* Add Gallery Modal */}
            <Modal
                show={showAddGalleryModal}
                onClose={() => setShowAddGalleryModal(false)}
                title="Unggah Foto Galeri"
                maxWidth="md"
            >
                <form onSubmit={handleAddGallerySubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pilih File Foto *</label>
                        {addGalleryPhotoPreview && (
                            <img src={addGalleryPhotoPreview} alt="Preview" className="w-full h-36 rounded-xl object-cover mb-2 border border-slate-200" />
                        )}
                        <input
                            type="file"
                            required
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    addGalleryForm.setData('image', file);
                                    setAddGalleryPhotoPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF]"
                        />
                        {addGalleryForm.errors.image && <p className="text-xs text-rose-500 mt-1">{addGalleryForm.errors.image}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                        <select
                            value={addGalleryForm.data.category}
                            onChange={(e) => addGalleryForm.setData('category', e.target.value)}
                            className={selectBaseClass}
                        >
                            <option value="Fleet & Safety">Fleet & Safety (Armada & Car Seat)</option>
                            <option value="Tours & Destinations">Tours & Destinations</option>
                            <option value="Happy Families">Happy Families</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Caption</label>
                        <input
                            type="text"
                            value={addGalleryForm.data.caption}
                            onChange={(e) => addGalleryForm.setData('caption', e.target.value)}
                            placeholder="e.g. Pemasangan child seat ISOFIX pada armada Innova Zenix"
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddGalleryModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={addGalleryForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {addGalleryForm.processing ? 'Mengunggah...' : 'Unggah Foto'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Gallery Modal */}
            <Modal
                show={showEditGalleryModal}
                onClose={() => setShowEditGalleryModal(false)}
                title="Edit Keterangan Foto Galeri"
                maxWidth="md"
            >
                <form onSubmit={handleEditGallerySubmit} className="space-y-4">
                    {editGalleryPhotoPreview && (
                        <img src={editGalleryPhotoPreview} alt="Preview" className="w-full h-36 rounded-xl object-cover border border-slate-200" />
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Ganti File Foto (Opsional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    editGalleryForm.setData('image', file);
                                    setEditGalleryPhotoPreview(URL.createObjectURL(file));
                                }
                            }}
                            className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                        <select
                            value={editGalleryForm.data.category}
                            onChange={(e) => editGalleryForm.setData('category', e.target.value)}
                            className={selectBaseClass}
                        >
                            <option value="Fleet & Safety">Fleet & Safety (Armada & Car Seat)</option>
                            <option value="Tours & Destinations">Tours & Destinations</option>
                            <option value="Happy Families">Happy Families</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Caption</label>
                        <input
                            type="text"
                            value={editGalleryForm.data.caption}
                            onChange={(e) => editGalleryForm.setData('caption', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditGalleryModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editGalleryForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {editGalleryForm.processing ? 'Menyimpan...' : 'Perbarui Foto'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Gallery Modal */}
            <Modal
                show={showDeleteGalleryModal}
                onClose={() => setShowDeleteGalleryModal(false)}
                title="Hapus Foto Galeri"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus foto galeri ini?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteGalleryModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteGallery}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ================================================================= */}
            {/* FAQ MODALS */}
            {/* ================================================================= */}
            {/* Add FAQ Modal */}
            <Modal
                show={showAddFaqModal}
                onClose={() => setShowAddFaqModal(false)}
                title="Tambah FAQ Baru"
                maxWidth="md"
            >
                <form onSubmit={handleAddFaqSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={addFaqForm.data.question}
                            onChange={(e) => addFaqForm.setData('question', e.target.value)}
                            placeholder="e.g. Apakah child seat sudah termasuk dalam harga?"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Jawaban <span className="text-red-500">*</span></label>
                        <textarea
                            rows="4"
                            required
                            value={addFaqForm.data.answer}
                            onChange={(e) => addFaqForm.setData('answer', e.target.value)}
                            placeholder="Tuliskan jawaban yang ramah dan informatif..."
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil (Display Order)</label>
                        <input
                            type="number"
                            value={addFaqForm.data.display_order}
                            onChange={(e) => addFaqForm.setData('display_order', parseInt(e.target.value, 10) || 0)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddFaqModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={addFaqForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {addFaqForm.processing ? 'Menyimpan...' : 'Simpan FAQ'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit FAQ Modal */}
            <Modal
                show={showEditFaqModal}
                onClose={() => setShowEditFaqModal(false)}
                title="Edit FAQ"
                maxWidth="md"
            >
                <form onSubmit={handleEditFaqSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={editFaqForm.data.question}
                            onChange={(e) => editFaqForm.setData('question', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Jawaban <span className="text-red-500">*</span></label>
                        <textarea
                            rows="4"
                            required
                            value={editFaqForm.data.answer}
                            onChange={(e) => editFaqForm.setData('answer', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil</label>
                        <input
                            type="number"
                            value={editFaqForm.data.display_order}
                            onChange={(e) => editFaqForm.setData('display_order', parseInt(e.target.value, 10) || 0)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditFaqModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editFaqForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {editFaqForm.processing ? 'Menyimpan...' : 'Perbarui FAQ'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete FAQ Modal */}
            <Modal
                show={showDeleteFaqModal}
                onClose={() => setShowDeleteFaqModal(false)}
                title="Hapus FAQ"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus pertanyaan ini?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteFaqModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteFaq}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            {/* ================================================================= */}
            {/* SITE FEATURE (WHY US) MODALS */}
            {/* ================================================================= */}
            {/* Add Feature Modal */}
            <Modal
                show={showAddFeatureModal}
                onClose={() => setShowAddFeatureModal(false)}
                title="Tambah Poin Keunggulan (Why Choose Us)"
                maxWidth="md"
            >
                <form onSubmit={handleAddFeatureSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Keunggulan *</label>
                        <input
                            type="text"
                            required
                            value={addFeatureForm.data.title}
                            onChange={(e) => addFeatureForm.setData('title', e.target.value)}
                            placeholder="e.g. Free Certified Child Seats"
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                            rows="3"
                            value={addFeatureForm.data.description}
                            onChange={(e) => addFeatureForm.setData('description', e.target.value)}
                            placeholder="Penjelasan ringkas mengapa layanan ini aman bagi keluarga..."
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Icon Name</label>
                            <input
                                type="text"
                                value={addFeatureForm.data.icon}
                                onChange={(e) => addFeatureForm.setData('icon', e.target.value)}
                                placeholder="e.g. ShieldCheck, Heart"
                                className={inputBaseClass}
                            />
                            <p className="text-[11px] text-slate-500 mt-1">Nama icon dari Phosphor Icons (cari di phosphoricons.com)</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil</label>
                            <input
                                type="number"
                                value={addFeatureForm.data.display_order}
                                onChange={(e) => addFeatureForm.setData('display_order', parseInt(e.target.value, 10) || 0)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowAddFeatureModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={addFeatureForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {addFeatureForm.processing ? 'Menyimpan...' : 'Simpan Keunggulan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Feature Modal */}
            <Modal
                show={showEditFeatureModal}
                onClose={() => setShowEditFeatureModal(false)}
                title="Edit Poin Keunggulan"
                maxWidth="md"
            >
                <form onSubmit={handleEditFeatureSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Keunggulan *</label>
                        <input
                            type="text"
                            required
                            value={editFeatureForm.data.title}
                            onChange={(e) => editFeatureForm.setData('title', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                        <textarea
                            rows="3"
                            value={editFeatureForm.data.description}
                            onChange={(e) => editFeatureForm.setData('description', e.target.value)}
                            className={inputBaseClass}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Icon Name</label>
                            <input
                                type="text"
                                value={editFeatureForm.data.icon}
                                onChange={(e) => editFeatureForm.setData('icon', e.target.value)}
                                className={inputBaseClass}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Urutan Tampil</label>
                            <input
                                type="number"
                                value={editFeatureForm.data.display_order}
                                onChange={(e) => editFeatureForm.setData('display_order', parseInt(e.target.value, 10) || 0)}
                                className={inputBaseClass}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setShowEditFeatureModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={editFeatureForm.processing}
                            className="bg-[#00AEEF] hover:bg-[#009cd7] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                        >
                            {editFeatureForm.processing ? 'Menyimpan...' : 'Perbarui Keunggulan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Feature Modal */}
            <Modal
                show={showDeleteFeatureModal}
                onClose={() => setShowDeleteFeatureModal(false)}
                title="Hapus Poin Keunggulan"
                maxWidth="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Yakin ingin menghapus poin keunggulan ini?
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteFeatureModal(false)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteFeature}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
