import React, { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { UserCircle, Mail, Phone, MapPin, Briefcase, Star, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props { onNavigate: (path: string) => void; }

export const PerfilPage: React.FC<Props> = ({ onNavigate }) => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:     user?.name     || '',
    lastName: user?.lastName || '',
    phone:    user?.phone    || '',
    city:     user?.city     || '',
  });

  const handleSave = () => {
    updateUser(form);
    toast.success('Perfil actualizado');
    setEditing(false);
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-white">Mi Perfil</h1>
        {!editing
          ? <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-slate-300 hover:text-white text-sm transition-all"><Edit3 size={14} /> Editar</button>
          : <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500 text-white text-sm font-semibold hover:bg-accent-600 transition-all"><Save size={14} /> Guardar</button>
              <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-slate-400 text-sm transition-all"><X size={14} /> Cancelar</button>
            </div>
        }
      </div>

      {/* Avatar + info */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name} {user.lastName}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <span className="mt-2 inline-block px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-semibold border border-primary-500/30">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="font-semibold text-white mb-5">Información personal</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { key: 'name',     label: 'Nombre',    icon: UserCircle, value: form.name },
            { key: 'lastName', label: 'Apellido',  icon: UserCircle, value: form.lastName },
            { key: 'phone',    label: 'Teléfono',  icon: Phone,      value: form.phone },
            { key: 'city',     label: 'Ciudad',    icon: MapPin,     value: form.city },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <f.icon size={12} /> {f.label}
              </label>
              {editing
                ? <input value={f.value} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
                : <p className="text-white text-sm py-2.5 px-4 bg-dark-700 rounded-xl border border-white/5">{f.value || '—'}</p>
              }
            </div>
          ))}
        </div>
      </div>

      {/* Skills (candidato) */}
      {user.skills && (
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Briefcase size={16} className="text-accent-500" /> Habilidades</h3>
          <div className="flex flex-wrap gap-2">
            {user.skills.map(s => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
