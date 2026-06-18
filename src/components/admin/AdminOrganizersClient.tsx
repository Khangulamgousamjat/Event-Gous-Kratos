'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';
import { createOrganizer, updateOrganizer, deleteOrganizer } from '@/lib/actions';
import { CldUploadWidget } from 'next-cloudinary';
import { Pencil, Trash2, Plus, X, Upload, ExternalLink } from 'lucide-react';

interface Organizer {
  id: string;
  organizerName: string;
  role: string | null;
  contact: string | null;
  imageUrl: string | null;
  description: string | null;
  department: string | null;
  linkedin: string | null;
  instagram: string | null;
  sortOrder: number | null;
  createdAt: Date | null;
}

interface CloudinaryResult {
  info: {
    secure_url: string;
  };
}

const DEPARTMENTS = ['Core', 'Tech', 'Design', 'Marketing', 'Events', 'Execution'];

const FormField = ({
  label,
  name,
  value,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  name: string;
  value?: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</label>
    <input
      name={name}
      defaultValue={value}
      type={type}
      required={required}
      className="w-full p-2.5 brutal-border bg-surface text-sm font-mono font-bold outline-none focus:border-primary focus:shadow-[3px_3px_0px_0px_var(--primary-container)] transition-all"
      placeholder={placeholder}
    />
  </div>
);

export default function AdminOrganizersClient({ organizers }: { organizers: Organizer[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createImageUrl, setCreateImageUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCreateDepts, setSelectedCreateDepts] = useState<string[]>([]);
  const [selectedEditDepts, setSelectedEditDepts] = useState<string[]>([]);

  const toggleDept = (dept: string, isEdit: boolean) => {
    const current = isEdit ? selectedEditDepts : selectedCreateDepts;
    const setter = isEdit ? setSelectedEditDepts : setSelectedCreateDepts;

    if (dept === 'Core') {
      // Selecting Core deselects everything else
      setter(current.includes('Core') ? [] : ['Core']);
    } else {
      // Selecting anything else deselects Core
      let next = current.filter((d) => d !== 'Core');
      if (next.includes(dept)) {
        next = next.filter((d) => d !== dept);
      } else {
        next = [...next, dept];
      }
      setter(next);
    }
  };

  const editingOrganizer = organizers.find((o) => o.id === editingId);

  return (
    <div className="space-y-8">
      {/* Toggle create form */}
      <div className="flex justify-end">
        <BrutalButton
          size="md"
          variant={showCreateForm ? 'outline' : 'primary'}
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setCreateImageUrl('');
          }}
          className="flex items-center gap-2"
        >
          {showCreateForm ? <X size={18} /> : <Plus size={18} />}
          {showCreateForm ? 'CANCEL' : 'ADD ORGANIZER'}
        </BrutalButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        {showCreateForm && (
          <div className="lg:col-span-5">
            <BrutalCard shadowColor="gold" className="p-6">
              <h2 className="text-xl font-black uppercase italic mb-5 border-b-2 border-on-surface pb-3 flex items-center gap-2">
                <Plus size={20} /> New Organizer
              </h2>
              <form
                action={async (formData: FormData) => {
                  formData.set('imageUrl', createImageUrl);
                  await createOrganizer(formData);
                  setCreateImageUrl('');
                  setShowCreateForm(false);
                }}
                className="space-y-4"
              >
                <FormField label="Name *" name="organizerName" placeholder="e.g. John Doe" required />
                <FormField label="Role" name="role" placeholder="e.g. Tech Lead" />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Departments (Multi-select)</label>
                  <div className="flex flex-wrap gap-2">
                    {DEPARTMENTS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDept(d, false)}
                        className={`px-3 py-1.5 text-[10px] font-black uppercase border-2 transition-all ${
                          selectedCreateDepts.includes(d)
                            ? 'bg-on-surface text-surface border-on-surface'
                            : 'bg-surface text-on-surface border-on-surface/20 hover:border-on-surface'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <input type="hidden" name="department" value={selectedCreateDepts.join(',')} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Description</label>
                  <textarea
                    name="description"
                    rows={2}
                    className="w-full p-2.5 brutal-border bg-surface text-sm font-sans outline-none focus:border-primary resize-none"
                    placeholder="Short bio..."
                  />
                </div>

                {/* Image upload */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Profile Image</label>
                  <div className="flex gap-2">
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'}
                      onSuccess={(result: unknown) => {
                        const res = result as CloudinaryResult;
                        if (res?.info?.secure_url) {
                          setCreateImageUrl(res.info.secure_url);
                        }
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="flex items-center gap-2 px-4 py-2.5 brutal-border bg-surface hover:bg-primary-container/20 transition-colors text-xs font-bold uppercase"
                        >
                          <Upload size={14} /> Upload
                        </button>
                      )}
                    </CldUploadWidget>
                    {createImageUrl && (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Image
                          src={createImageUrl}
                          alt="Preview"
                          width={40}
                          height={40}
                          className="w-10 h-10 brutal-border object-cover"
                        />
                        <span className="text-[10px] font-mono truncate flex-1 opacity-60">{createImageUrl.split('/').pop()}</span>
                        <button type="button" onClick={() => setCreateImageUrl('')} className="text-red-600 hover:text-red-800">
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <input
                    name="imageUrlText"
                    placeholder="Or paste image URL..."
                    value={createImageUrl}
                    onChange={(e) => setCreateImageUrl(e.target.value)}
                    className="w-full p-2 brutal-border bg-surface text-xs font-mono outline-none focus:border-primary mt-1"
                  />
                </div>

                <FormField label="Contact" name="contact" placeholder="Email or Phone" />
                <FormField label="LinkedIn URL" name="linkedin" placeholder="https://linkedin.com/in/..." />
                <FormField label="Instagram URL" name="instagram" placeholder="https://instagram.com/..." />
                <FormField label="Sort Order" name="sortOrder" placeholder="0" type="number" />

                <BrutalButton type="submit" size="md" className="w-full">
                  ADD ORGANIZER
                </BrutalButton>
              </form>
            </BrutalCard>
          </div>
        )}

        {/* Organizer List */}
        <div className={showCreateForm ? 'lg:col-span-7' : 'lg:col-span-12'}>
          <BrutalCard shadowColor="black" className="p-0 overflow-hidden">
            <div className="p-5 border-b-2 border-on-surface bg-surface-container-low flex justify-between items-center">
              <h2 className="text-xl font-black uppercase italic">Published Organizers</h2>
              <div className="flex items-center gap-3">
                <a
                  href="/organizers"
                  target="_blank"
                  className="text-[10px] font-black uppercase border-b-2 border-on-surface hover:text-primary hover:border-primary transition-colors flex items-center gap-1"
                >
                  <ExternalLink size={10} /> Preview Page
                </a>
                <div className="text-xs font-black uppercase opacity-60">{organizers.length} total</div>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[75vh]">
              <table className="w-full text-left font-sans">
                <thead className="bg-surface-container-low border-b-2 border-on-surface text-[9px] font-black uppercase tracking-widest sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Dept</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Social</th>
                    <th className="p-3">#</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-on-surface/10">
                  {organizers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-16 text-center opacity-40 font-black uppercase">
                        NO ORGANIZERS CREATED — ADD YOUR FIRST ONE ABOVE
                      </td>
                    </tr>
                  ) : (
                    organizers.map((org) => (
                      <tr key={org.id} className="hover:bg-primary-container/5 transition-colors">
                        <td className="p-3">
                          {org.imageUrl ? (
                            <Image
                              src={org.imageUrl}
                              alt={org.organizerName}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover brutal-border"
                            />
                          ) : (
                            <div className="w-10 h-10 brutal-border bg-surface-container-low flex items-center justify-center text-[10px] font-black opacity-30">
                              N/A
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-bold uppercase text-sm max-w-[150px] truncate">{org.organizerName}</td>
                        <td className="p-3 text-xs font-bold text-primary uppercase">{org.role || '—'}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-[150px]">
                            {org.department ? (
                              org.department.split(',').map((d) => (
                                <span key={d} className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 brutal-border bg-primary-container/20">
                                  {d}
                                </span>
                              ))
                            ) : (
                              <span className="opacity-30">—</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-mono text-xs opacity-70 max-w-[120px] truncate">{org.contact || '—'}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {org.linkedin && <span className="text-[8px] font-black uppercase bg-blue-100 text-blue-800 px-1 py-0.5 border border-blue-800">LI</span>}
                            {org.instagram && <span className="text-[8px] font-black uppercase bg-pink-100 text-pink-800 px-1 py-0.5 border border-pink-800">IG</span>}
                          </div>
                        </td>
                        <td className="p-3 text-xs font-mono opacity-40">{org.sortOrder ?? 0}</td>
                        <td className="p-3">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => {
                                setEditingId(org.id);
                                setEditImageUrl(org.imageUrl || '');
                                setSelectedEditDepts(org.department ? org.department.split(',') : []);
                              }}
                              className="p-2 brutal-border bg-surface hover:bg-primary-container/20 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <form action={deleteOrganizer}>
                              <input type="hidden" name="id" value={org.id} />
                              <button
                                type="submit"
                                className="p-2 brutal-border bg-red-50 text-red-800 border-red-800 hover:bg-red-200 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </BrutalCard>
        </div>
      </div>

      {/* ── EDIT MODAL ────────────────────────────────────────────────── */}
      {editingOrganizer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setEditingId(null)}>
          <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-md" />
          <div
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface brutal-border shadow-[8px_8px_0px_0px_var(--primary-container)] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setEditingId(null)}
              className="absolute top-4 right-4 p-2 brutal-border bg-surface hover:bg-red-100 transition-colors"
            >
              <X size={16} />
            </button>

            <h2 className="text-2xl font-black uppercase italic mb-6 border-b-2 border-on-surface pb-3 flex items-center gap-2">
              <Pencil size={20} /> Edit Organizer
            </h2>

            <form
              action={async (formData: FormData) => {
                formData.set('imageUrl', editImageUrl);
                await updateOrganizer(formData);
                setEditingId(null);
                setEditImageUrl('');
              }}
              className="space-y-4"
            >
              <input type="hidden" name="id" value={editingOrganizer.id} />

              <FormField label="Name *" name="organizerName" value={editingOrganizer.organizerName} placeholder="Name" required />
              <FormField label="Role" name="role" value={editingOrganizer.role || ''} placeholder="Role" />

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Departments (Multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDept(d, true)}
                      className={`px-3 py-1.5 text-[10px] font-black uppercase border-2 transition-all ${
                        selectedEditDepts.includes(d)
                          ? 'bg-on-surface text-surface border-on-surface'
                          : 'bg-surface text-on-surface border-on-surface/20 hover:border-on-surface'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="department" value={selectedEditDepts.join(',')} />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingOrganizer.description || ''}
                  className="w-full p-2.5 brutal-border bg-surface text-sm font-sans outline-none focus:border-primary resize-none"
                  placeholder="Short bio..."
                />
              </div>

              {/* Image upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-60">Profile Image</label>
                <div className="flex gap-2 items-center">
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default'}
                    onSuccess={(result: unknown) => {
                      const res = result as CloudinaryResult;
                      if (res?.info?.secure_url) {
                        setEditImageUrl(res.info.secure_url);
                      }
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="flex items-center gap-2 px-4 py-2.5 brutal-border bg-surface hover:bg-primary-container/20 transition-colors text-xs font-bold uppercase"
                      >
                        <Upload size={14} /> Upload
                      </button>
                    )}
                  </CldUploadWidget>
                  {editImageUrl && (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Image
                        src={editImageUrl}
                        alt="Preview"
                        width={40}
                        height={40}
                        className="w-10 h-10 brutal-border object-cover"
                      />
                      <button type="button" onClick={() => setEditImageUrl('')} className="text-red-600 hover:text-red-800">
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <input
                  name="imageUrlText"
                  placeholder="Or paste image URL..."
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full p-2 brutal-border bg-surface text-xs font-mono outline-none focus:border-primary mt-1"
                />
              </div>

              <FormField label="Contact" name="contact" value={editingOrganizer.contact || ''} placeholder="Email or Phone" />
              <FormField label="LinkedIn URL" name="linkedin" value={editingOrganizer.linkedin || ''} placeholder="https://linkedin.com/in/..." />
              <FormField label="Instagram URL" name="instagram" value={editingOrganizer.instagram || ''} placeholder="https://instagram.com/..." />
              <FormField label="Sort Order" name="sortOrder" value={String(editingOrganizer.sortOrder ?? 0)} placeholder="0" type="number" />

              <div className="flex gap-3 pt-2">
                <BrutalButton type="submit" size="md" className="flex-1">
                  SAVE CHANGES
                </BrutalButton>
                <BrutalButton type="button" size="md" variant="outline" onClick={() => setEditingId(null)}>
                  CANCEL
                </BrutalButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
