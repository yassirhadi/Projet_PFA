import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { authApi } from '../api/authApi';

const emailSchema = z.object({
  email: z.string().email('Email invalide'),
});

const resetSchema = z
  .object({
    nouveauMotDePasse: z.string().min(8, 'Au moins 8 caractères'),
    confirmationMotDePasse: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.nouveauMotDePasse === data.confirmationMotDePasse, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmationMotDePasse'],
  });

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { nouveauMotDePasse: '', confirmationMotDePasse: '' },
  });

  const onVerifyEmail = async (data) => {
    try {
      await authApi.verifyForgotPasswordEmail(data.email.trim());
      setEmail(data.email.trim());
      setStep('password');
      toast.success('Email reconnu. Choisissez un nouveau mot de passe.');
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        status === 404
          ? err?.response?.data?.message || 'Aucun compte étudiant trouvé avec cet email.'
          : err?.response?.data?.message || 'Impossible de vérifier l’email. Réessayez.';
      toast.error(msg, { toastId: 'forgot-verify' });
    }
  };

  const onResetPassword = async (data) => {
    try {
      await authApi.resetForgotPassword({
        email,
        nouveauMotDePasse: data.nouveauMotDePasse,
        confirmationMotDePasse: data.confirmationMotDePasse,
      });
      toast.success('Mot de passe mis à jour. Connectez-vous.');
      navigate('/login', { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ||
        (status === 400
          ? 'Données invalides (mot de passe ou confirmation).'
          : 'Impossible de réinitialiser le mot de passe.');
      toast.error(msg, { toastId: 'forgot-reset' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-teal-400 tracking-widest">CV·ANALYSER</h1>
          <p className="text-slate-500 mt-2">Mot de passe oublié (compte étudiant)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          {step === 'email' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Votre email</h2>
              <p className="text-slate-500 text-sm mb-6">
                Saisissez l’adresse liée à votre compte étudiant. Nous vérifierons qu’elle existe.
              </p>
              <form onSubmit={emailForm.handleSubmit(onVerifyEmail)} className="space-y-4" noValidate>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Email</label>
                  <input
                    {...emailForm.register('email')}
                    type="email"
                    autoComplete="email"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-teal-500"
                    placeholder="etudiant@email.com"
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-400 text-xs mt-1">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={emailForm.formState.isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {emailForm.formState.isSubmitting ? 'Vérification...' : 'Continuer'}
                </button>
              </form>
            </>
          )}

          {step === 'password' && (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Nouveau mot de passe</h2>
              <p className="text-slate-400 text-sm mb-4">
                Compte : <span className="text-teal-400">{email}</span>
              </p>
              <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4" noValidate>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      {...resetForm.register('nouveauMotDePasse')}
                      type={showNewPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-teal-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md text-slate-400 hover:text-teal-400 hover:bg-slate-700/50 transition-colors"
                      aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" aria-hidden /> : <Eye className="w-5 h-5" aria-hidden />}
                    </button>
                  </div>
                  {resetForm.formState.errors.nouveauMotDePasse && (
                    <p className="text-red-400 text-xs mt-1">{resetForm.formState.errors.nouveauMotDePasse.message}</p>
                  )}
                  <p className="text-slate-500 text-xs mt-1">
                    8+ caractères, majuscule, minuscule, chiffre et caractère spécial (@$!%*?&#)
                  </p>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      {...resetForm.register('confirmationMotDePasse')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-teal-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-md text-slate-400 hover:text-teal-400 hover:bg-slate-700/50 transition-colors"
                      aria-label={showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" aria-hidden /> : <Eye className="w-5 h-5" aria-hidden />}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmationMotDePasse && (
                    <p className="text-red-400 text-xs mt-1">
                      {resetForm.formState.errors.confirmationMotDePasse.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={resetForm.formState.isSubmitting}
                  className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {resetForm.formState.isSubmitting ? 'Enregistrement...' : 'Enregistrer et aller à la connexion'}
                </button>
              </form>
            </>
          )}

          <Link
            to="/login"
            className="mt-6 w-full text-sm text-teal-400 hover:text-teal-300 font-medium inline-flex items-center justify-center gap-1 hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
