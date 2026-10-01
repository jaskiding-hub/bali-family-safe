import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition";
const textareaClass = "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] transition resize-none";

export default function AboutContentTab({ aboutContent = [] }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [addPhotoPreview, setAddPhotoPreview] = useState(null);
    const [editPhotoPreview, setEditPhotoPreview] = useState(null);

    const addForm = useForm({
        title: '',
        description: '',
        image: null,
        is_active: true,
    });

    const editForm = useForm({
        _method: 'put',
        title: '',
        description: '',
        image: null,
        is_active: true,
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post('/admin/about-content', {
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
        editForm.post(`/admin/about-content/${selected.id}`, {
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
        router.delete(`/admin/about-content/${selected.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelected(null);
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">About Us Content</h2>
                    <p className="text-sm text-slate-600 mt-1">Manage about section content</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-[#00AEEF] hover:bg-[#0097d1] text-white text-sm font-medium rounded-lg transition"
                >
                    + Add Content
                </button>
            </div>

            <div className="grid gap-4">
                {aboutContent.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-600">No content yet. Click "Add Content" to create.</p>
                    </div>
                ) : (
                    aboutContent.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4">
                            {item.image_url && (
                                <img src={item.image_url} alt={item.title} className="w-32 h-32 object-cover rounded-lg" />
                            )}
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                                <div className="flex items-center gap-2 mt-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {item.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEditModal(item)} className="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition">Edit</button>
                                <button onClick={() => { setSelected(item); setShowDeleteModal(true); }} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="2xl">
                <form onSubmit={handleAddSubmit} className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Add About Content</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                            <input type="text" value={addForm.data.title} onChange={e => addForm.setData('title', e.target.value)} className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea value={addForm.data.description} onChange={e => addForm.setData('description', e.target.value)} rows="5" className={textareaClass} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    addForm.setData('image', file);
                                    if (file) setAddPhotoPreview(URL.createObjectURL(file));
                                }}
                                className={inputClass}
                            />
                            {addPhotoPreview && <img src={addPhotoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="add-active" checked={addForm.data.is_active} onChange={e => addForm.setData('is_active', e.target.checked)} className="rounded" />
                            <label htmlFor="add-active" className="text-sm text-slate-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                        <button type="submit" disabled={addForm.processing} className="flex-1 px-4 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#0097d1] transition disabled:opacity-50">
                            {addForm.processing ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="2xl">
                <form onSubmit={handleEditSubmit} className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit About Content</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                            <input type="text" value={editForm.data.title} onChange={e => editForm.setData('title', e.target.value)} className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                            <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} rows="5" className={textareaClass} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    editForm.setData('image', file);
                                    if (file) setEditPhotoPreview(URL.createObjectURL(file));
                                }}
                                className={inputClass}
                            />
                            {editPhotoPreview && <img src={editPhotoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="edit-active" checked={editForm.data.is_active} onChange={e => editForm.setData('is_active', e.target.checked)} className="rounded" />
                            <label htmlFor="edit-active" className="text-sm text-slate-700">Active</label>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                        <button type="submit" disabled={editForm.processing} className="flex-1 px-4 py-2 bg-[#00AEEF] text-white rounded-lg hover:bg-[#0097d1] transition disabled:opacity-50">
                            {editForm.processing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete About Content</h3>
                    <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete this content? This action cannot be undone.</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
