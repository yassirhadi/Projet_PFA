import { useState } from 'react';
import { useForm }        from 'react-hook-form';
import { zodResolver }    from '@hookform/resolvers/zod';
import { z }             from 'zod';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth }        from '../../hooks/useAuth';

const schema = z.object({
  email:    z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

const LoginForm = () => {
  const { loginAndRedirect } = useAuth();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => loginAndRedirect(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

      {/* Email */}
      <div>
        <label className="block text-slate-400 text-sm mb-1">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="user@gmail.com"
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg
                         pl-9 pr-4 py-3 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        {errors.email && (
          <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-slate-400 text-sm mb-1">Mot de passe</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            {...register('password')}
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="votre mot de passe"
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg
                         pl-9 pr-10 py-3 focus:outline-none focus:border-teal-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            aria-label="Afficher/masquer le mot de passe"
          >
            {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connexion...
          </>
        ) : 'Se connecter'}
      </button>
    </form>
  );
};

export default LoginForm;