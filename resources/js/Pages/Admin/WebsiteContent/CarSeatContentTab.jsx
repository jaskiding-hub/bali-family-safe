import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition";
const textareaClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition resize-none";

export default function CarSeatContentTab({ carSeatContent = [] }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [addPhotoPreview, setAddPhotoPreview] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);

    const addForm = useForm({
        tag: '',
        title: '',
        description: '',
        image: null,
        is_active: true,
    });

    const editForm = useForm({
        _method: 'put',
        tag: '',
        title: '',
        description: '',
        image: null,
        is_active: true,
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/car-seat-content', {
            forceFormData: true,
            onSuccess: () => {
                setShowAddModal(false);
                addForm.reset();
                setAddPhotoPreview(null);
            },
        });
    };

    const openEditModal = (item) => {
        setSelected(item);
        editForm.setData({
            _method: 'put',
            tag: item.tag || '',
            title: item.title || '',
            description: item.description || '',
            image: null,
            is_active: Boolean(item.is_active),
        });
        setEditPhotoPreview(item.image_url || null);
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selected) return;
        editForm.post(`/admin/car-seat-content/${selected.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
                editForm.reset();
                setEditPhotoPreview(null);
                setSelected(null);
            },
        });
    };

    const handleDelete = () => {
        if (!selected) return;
        router.delete(`/admin/car-seat-content/${selected.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelected(null);
            },
        });
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                    <h3 className="text-base font-bold text-slate-900">Fasilitas Child Car Seats</h3>
                    <p className="text-xs text-slate-500">Kelola kategori umur dan standar car seat keselamatan anak.</p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setAddPhotoPreview(null);
                        addForm.reset();
                        setShowAddModal(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#00AEEF] hover:bg-[#009cd7] text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Tambah Car Seat</span>
                </button>
            </div>

            <div className="grid gap-4">
                {carSeatContent.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm">
                        Belum ada data car seat. Klik "Tambah Car Seat" untuk mulai membuat.
                    </div>
                ) : (
                    carSeatContent.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                            {item.image_url && (
                                <img src={item.image_url} alt={item.title} className="w-full sm:w-32 h-44 sm:h-32 object-cover rounded-xl shrink-0 border border-slate-200" />
                            )}
                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00AEEF] bg-sky-50 px-2 py-0.5 rounded-md inline-block">{item.tag}</span>
                                <h4 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h4>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                        <span>{item.is_active ? 'Aktif' : 'Non-aktif'}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end sm:justify-start pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => openEditModal(item)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSelected(item); setShowDeleteModal(true); }}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <Modal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Tambah Child Car Seat"
                maxWidth="2xl"
            >
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tag Kategori Umur (e.g. "Age 0-12 Months") <span className="text-red-500">*</span></label>
                        <input type="text" value={addForm.data.tag} onChange={e => addForm.setData('tag', e.target.value)} className={inputClass} required placeholder="e.g. Age 0-12 Months" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama / Tipe Car Seat <span className="text-red-500">*</span></label>
                        <input type="text" value={addForm.data.title} onChange={e => addForm.setData('title', e.target.value)} className={inputClass} required placeholder="e.g. Infant Safety Capsule" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Standar Keselamatan <span className="text-red-500">*</span></label>
                        <textarea value={addForm.data.description} onChange={e => addForm.setData('description', e.target.value)} rows="4" className={textareaClass} required placeholder="Rincian fitur dan sertifikasi car seat..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto Car Seat</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                addForm.setData('image', file);
                                if (file) setAddPhotoPreview(URL.createObjectURL(file));
                            }}
                            className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF] hover:file:bg-sky-100 cursor-pointer"
                        />
                        {addPhotoPreview && <img src={addPhotoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border border-slate-200" />}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <input type="checkbox" id="add-active" checked={addForm.data.is_active} onChange={e => addForm.setData('is_active', e.target.checked)} className="rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                        <label htmlFor="add-active" className="text-xs font-medium text-slate-700">Aktif (Tampilkan di halaman website)</label>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition cursor-pointer">Batal</button>
                        <button type="submit" disabled={addForm.processing} className="px-5 py-2 bg-[#00AEEF] text-white rounded-xl hover:bg-[#009cd7] text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs">
                            {addForm.processing ? 'Menyimpan...' : 'Tambah Car Seat'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Child Car Seat"
                maxWidth="2xl"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tag Kategori Umur <span className="text-red-500">*</span></label>
                        <input type="text" value={editForm.data.tag} onChange={e => editForm.setData('tag', e.target.value)} className={inputClass} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama / Tipe Car Seat <span className="text-red-500">*</span></label>
                        <input type="text" value={editForm.data.title} onChange={e => editForm.setData('title', e.target.value)} className={inputClass} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Standar Keselamatan <span className="text-red-500">*</span></label>
                        <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} rows="4" className={textareaClass} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Foto Car Seat</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => {
                                const file = e.target.files[0];
                                editForm.setData('image', file);
                                if (file) setEditPhotoPreview(URL.createObjectURL(file));
                            }}
                            className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-[#00AEEF] hover:file:bg-sky-100 cursor-pointer"
                        />
                        {editPhotoPreview && <img src={editPhotoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-xl border border-slate-200" />}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                        <input type="checkbox" id="edit-active" checked={editForm.data.is_active} onChange={e => editForm.setData('is_active', e.target.checked)} className="rounded text-[#00AEEF] focus:ring-[#00AEEF]" />
                        <label htmlFor="edit-active" className="text-xs font-medium text-slate-700">Aktif (Tampilkan di halaman website)</label>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition cursor-pointer">Batal</button>
                        <button type="submit" disabled={editForm.processing} className="px-5 py-2 bg-[#00AEEF] text-white rounded-xl hover:bg-[#009cd7] text-xs font-bold transition disabled:opacity-50 cursor-pointer shadow-xs">
                            {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Hapus Child Car Seat"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600">Apakah Anda yakin ingin menghapus data car seat ini? Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button type="button" onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition cursor-pointer">Batal</button>
                        <button type="button" onClick={handleDelete} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs">Hapus</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
