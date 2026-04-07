import { useState } from 'react';
import { useForm }     from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z }          from 'zod';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, GraduationCap, Building2 } from 'lucide-react';
import { authApi }    from '../../api/authApi';
import { toast }      from 'react-toastify';

// Schéma Zod — correspond aux champs de la classe Etudiant du diagramme
const schema = z.object({
  nom:              z.string().min(2, 'Nom requis (min 2 caractères)'),
  email:            z.string().email('Email invalide'),
  password:         z.string().min(8, 'Min 8 caractères')
                     .regex(/[A-Z]/, 'Au moins une majuscule')
                     .regex(/[a-z]/, 'Au moins une minuscule')
                     .regex(/[0-9]/, 'Au moins un chiffre')
                     .regex(/[@$!%*?&#]/, 'Au moins un caractère spécial (@$!%*?&#)'),
  confirmPassword:  z.string(),
  niveauEtude:      z.string().min(1, 'Niveau requis'),
  domaineEtude:     z.string().min(2, 'Domaine requis'),
  universite:       z.string().min(2, 'Université requise'),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

const NIVEAUX = ['Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat'];

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-slate-400 text-sm mb-1">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const inputCls = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-teal-500 transition-colors";
const iconCls  = "absolute left-3 top-1/2 -translate-y-1/2 text-slate-500";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ confirmPassword, ...data }) => {
    try {
      const parts = data.nom.trim().split(/\s+/).filter(Boolean);
      const prenom = parts[0] || '';
      const nom = parts.length > 1 ? parts.slice(1).join(' ') : prenom;

      await authApi.register({
        nom,
        prenom,
        email: data.email,
        motDePasse: data.password,
        role: 'ETUDIANT',
        niveauEtude: data.niveauEtude,
        domaineEtude: data.domaineEtude,
        universite: data.universite,
      });
      toast.success('Compte créé ! Connectez-vous.');
      navigate('/login');
    } catch (err) {
      const body = err?.response?.data;
      const ve = body?.validationErrors;
      if (ve && typeof ve === 'object' && Object.keys(ve).length) {
        toast.error(Object.values(ve).join(' · '));
      } else if (typeof body?.message === 'string') {
        toast.error(body.message);
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* Nom */}
      <Field label="Nom complet" error={errors.nom?.message}>
        <div className="relative">
          <User size={15} className={iconCls} />
          <input {...register('nom')} placeholder="Votre nom"
            className={`${inputCls} pl-9`} />
        </div>
      </Field>

      {/* Email */}
      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <Mail size={15} className={iconCls} />
          <input {...register('email')} type="email" autoComplete="email"
            placeholder="user@gmail.com" className={`${inputCls} pl-9`} />
        </div>
      </Field>

      {/* Password */}
      <Field label="Mot de passe" error={errors.password?.message}>
        <div className="relative">
          <Lock size={15} className={iconCls} />
          <input {...register('password')} type={showPwd ? 'text' : 'password'}
            placeholder="Min 8 car., 1 majuscule, 1 chiffre"
            className={`${inputCls} pl-9 pr-10`} />
          <button type="button" onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </Field>

      {/* Confirm Password */}
      <Field label="Confirmer le mot de passe" error={errors.confirmPassword?.message}>
        <div className="relative">
          <Lock size={15} className={iconCls} />
          <input {...register('confirmPassword')} type="password"
            placeholder="••••••••" className={`${inputCls} pl-9`} />
        </div>
      </Field>

      {/* Niveau d'étude */}
      <Field label="Niveau d'étude" error={errors.niveauEtude?.message}>
        <div className="relative">
          <GraduationCap size={15} className={iconCls} />
          <select {...register('niveauEtude')} className={`${inputCls} pl-9`}>
            <option value="">Sélectionnez votre niveau</option>
            {NIVEAUX.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </Field>

      {/* Domaine */}
      <Field label="Domaine d'étude" error={errors.domaineEtude?.message}>
        <input {...register('domaineEtude')} placeholder="Informatique, Gestion, Droit..."
          className={inputCls} />
      </Field>

      {/* Université */}
      <Field label="Université" error={errors.universite?.message}>
        <div className="relative">
          <Building2 size={15} className={iconCls} />
          <input {...register('universite')} placeholder="Université Mohammed Premier..."
            className={`${inputCls} pl-9`} />
        </div>
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Inscription en cours...
          </>
        ) : 'Créer mon compte'}
      </button>
    </form>
  );
};

export default RegisterForm;