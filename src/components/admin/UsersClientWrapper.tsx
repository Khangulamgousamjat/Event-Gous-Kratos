'use client';

import React, { useState, useMemo } from 'react';
import BrutalCard from '@/components/ui/BrutalCard';
import BrutalButton from '@/components/ui/BrutalButton';

type User = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  college: string | null;
  branch: string | null;
  year: number | null;
  phone: string | null;
  role: 'ADMIN' | 'PARTICIPANT' | 'VOLUNTEER' | null;
  xp: number | null;
  level: number | null;
  createdAt: Date | null;
  updatedAt?: Date | null;
  registrationCount: number;
};

export type { User };

type Filter = 'all' | 'no-reg' | 'with-reg' | 'admin' | 'volunteer';

export default function UsersClientWrapper({
  users,
  updateUser,
  deleteUser,
}: {
  users: User[];
  updateUser: (formData: FormData) => Promise<void>;
  deleteUser: (formData: FormData) => Promise<void>;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = users;

    if (filter === 'no-reg') result = result.filter((u) => u.registrationCount === 0);
    else if (filter === 'with-reg') result = result.filter((u) => u.registrationCount > 0);
    else if (filter === 'admin') result = result.filter((u) => u.role === 'ADMIN');
    else if (filter === 'volunteer') result = result.filter((u) => u.role === 'VOLUNTEER');

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q) ||
          u.college?.toLowerCase().includes(q) ||
          u.branch?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [users, search, filter]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All Accounts' },
    { key: 'no-reg', label: 'No Registrations' },
    { key: 'with-reg', label: 'Registered' },
    { key: 'admin', label: 'Admins Only' },
    { key: 'volunteer', label: 'Volunteers' },
  ];

  return (
    <BrutalCard className="p-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-3 p-4 border-b-2 border-on-surface bg-surface-container-low">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                filter === f.key
                  ? 'bg-on-surface text-surface border-on-surface'
                  : 'border-on-surface/30 hover:border-on-surface'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs ml-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base opacity-50">
            search
          </span>
          <input
            type="text"
            placeholder="Search name, email, phone, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border-2 border-on-surface bg-transparent text-xs font-bold uppercase tracking-wide outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="px-5 py-2 bg-surface-container-low border-b border-on-surface/10 text-[10px] font-black uppercase tracking-widest opacity-50">
        Showing {filtered.length} of {users.length} accounts
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left font-sans">
          <thead className="bg-surface-container-low border-b-2 border-on-surface text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="p-4">Account</th>
              <th className="p-4">Contact / College</th>
              <th className="p-4">Events</th>
              <th className="p-4">Role / XP</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-on-surface/10">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm font-bold uppercase opacity-40">
                  No accounts found
                </td>
              </tr>
            )}
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-primary-container/5 transition-colors">
                <td className="p-4 w-1/5">
                  <form action={updateUser} id={`upd-${user.id}`}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="college" value={user.college ?? ''} />
                    <input type="hidden" name="branch" value={user.branch ?? ''} />
                    <input type="hidden" name="year" value={user.year ?? ''} />
                    <input type="hidden" name="phone" value={user.phone ?? ''} />
                    <input
                      name="name"
                      defaultValue={user.name}
                      className="bg-transparent font-black uppercase text-sm w-full outline-none focus:border-b-2 border-primary block"
                    />
                    <select 
                      name="role" 
                      defaultValue={user.role || 'PARTICIPANT'} 
                      className="mt-1 bg-transparent border-b border-primary/30 text-[10px] uppercase font-black outline-none w-full"
                    >
                      <option value="PARTICIPANT">Participant</option>
                      <option value="VOLUNTEER">Volunteer</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </form>
                  <span className="font-mono text-[11px] opacity-50 truncate block mt-1 max-w-[160px]">{user.email}</span>
                </td>

                <td className="p-4 w-1/5">
                  <form action={updateUser} id={`upd-college-${user.id}`}>
                    <input type="hidden" name="id" value={user.id} />
                    <input type="hidden" name="name" value={user.name} />
                    <input type="hidden" name="year" value={user.year ?? ''} />
                    <div className="space-y-1">
                      <input
                        name="phone"
                        defaultValue={user.phone ?? ''}
                        placeholder="NO PHONE"
                        className="bg-transparent font-mono text-xs w-full outline-none focus:border-b-2 border-primary opacity-70 focus:opacity-100 block"
                      />
                      <input
                        name="college"
                        defaultValue={user.college ?? ''}
                        placeholder="NO COLLEGE"
                        className="bg-transparent font-bold text-xs uppercase w-full outline-none focus:border-b-2 border-primary block"
                      />
                      <input
                        name="branch"
                        defaultValue={user.branch ?? ''}
                        placeholder="NO BRANCH"
                        className="bg-transparent font-bold text-xs opacity-60 uppercase w-full outline-none focus:border-b-2 border-primary focus:opacity-100 block"
                      />
                    </div>
                  </form>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 border-2 text-xs font-black uppercase ${
                      user.registrationCount === 0
                        ? 'bg-orange-50 text-orange-800 border-orange-400'
                        : 'bg-green-50 text-green-800 border-green-400'
                    }`}
                  >
                    {user.registrationCount === 0 ? 'None' : `${user.registrationCount} Event${user.registrationCount > 1 ? 's' : ''}`}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-0.5 border-2 text-[10px] font-black uppercase mb-1 ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 border-purple-800'
                        : 'bg-primary/20 text-on-surface border-on-surface/30'
                    }`}
                  >
                    {user.role}
                  </span>
                  <p className="text-[10px] opacity-50 font-bold uppercase mt-0.5">
                    XP {user.xp ?? 0} | Lv {user.level ?? 1}
                  </p>
                </td>

                <td className="p-4 text-xs font-mono opacity-60 whitespace-nowrap">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <BrutalButton
                      form={`upd-${user.id}`}
                      type="submit"
                      variant="secondary"
                      size="sm"
                      className="bg-blue-100 text-blue-800 border-blue-800 whitespace-nowrap"
                    >
                      Save
                    </BrutalButton>
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <BrutalButton
                        type="submit"
                        variant="secondary"
                        size="sm"
                        className="bg-red-100 text-red-800 border-red-800 whitespace-nowrap"
                        onClick={(e) => {
                          if (!confirm(`Delete account "${user.name}"? This cannot be undone.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </BrutalButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y-2 divide-on-surface/10">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm font-bold uppercase opacity-40">No accounts found</div>
        )}
        {filtered.map((user) => (
          <div key={user.id} className="p-4">
            <button
              className="w-full text-left flex justify-between items-start"
              onClick={() => setExpandedId(expandedId === user.id ? null : user.id)}
            >
              <div>
                <p className="font-black uppercase text-sm">{user.name}</p>
                <p className="font-mono text-[11px] opacity-50">{user.email}</p>
              </div>
              <div className="flex gap-2 items-center shrink-0 ml-3">
                <span
                  className={`px-2 py-0.5 border text-[10px] font-black uppercase ${
                    user.registrationCount === 0
                      ? 'bg-orange-50 text-orange-800 border-orange-400'
                      : 'bg-green-50 text-green-800 border-green-400'
                  }`}
                >
                  {user.registrationCount === 0 ? 'No reg' : `${user.registrationCount} reg`}
                </span>
                <span className="material-symbols-outlined text-base opacity-40">
                  {expandedId === user.id ? 'expand_less' : 'expand_more'}
                </span>
              </div>
            </button>

            {expandedId === user.id && (
              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
                  <div>
                    <p className="opacity-40 text-[10px]">Phone</p>
                    <p>{user.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px]">Role</p>
                    <span
                      className={`inline-block px-2 py-0.5 border text-[10px] font-black uppercase ${
                        user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800 border-purple-800'
                          : 'bg-primary/20 border-on-surface/30'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px]">College</p>
                    <p>{user.college || '-'}</p>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px]">Branch</p>
                    <p>{user.branch || '-'}</p>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px]">XP / Level</p>
                    <p>XP {user.xp ?? 0} | Lv {user.level ?? 1}</p>
                  </div>
                  <div>
                    <p className="opacity-40 text-[10px]">Joined</p>
                    <p>
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '-'}
                    </p>
                  </div>
                </div>
                <form action={deleteUser} className="pt-2">
                  <input type="hidden" name="id" value={user.id} />
                  <BrutalButton
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="bg-red-100 text-red-800 border-red-800 w-full"
                    onClick={(e) => {
                      if (!confirm(`Delete account "${user.name}"? This cannot be undone.`)) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Delete Account
                  </BrutalButton>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
