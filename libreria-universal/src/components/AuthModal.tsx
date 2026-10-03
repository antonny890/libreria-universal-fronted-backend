import React, { useState } from 'react';
import { useLibrary } from '../context/useLibrary';
import { X, BookOpen, Key, Mail, User, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, showToast } = useLibrary();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (tab === 'register' && password !== passwordConfirmation) {
      showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginUser(email, password, name.trim() ? name : undefined, tab === 'register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-[#FDFBF7] rounded-2xl max-w-md w-full border border-[#2C1E14]/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-6 text-center border-b border-[#2C1E14]/10 bg-[#FAF8F5]">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-md text-[#7A6858] hover:text-[#2C1E14] hover:bg-[#EFEAE0] transition-colors"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-[#2C1E14] text-[#D4AF37] rounded-xl flex items-center justify-center mx-auto mb-2.5 shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#2C1E14]">
            Librería Universal
          </h2>
          <p className="text-xs text-[#7A6858] mt-0.5">
            Portal de Acceso para Lectores &amp; Miembros del Círculo
          </p>

          {/* Tab selector */}
          <div className="flex border border-[#2C1E14]/15 rounded-lg p-0.5 bg-[#F2ECE1] mt-4 text-xs font-semibold">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 rounded transition-all ${
                tab === 'login' ? 'bg-white text-[#2C1E14] shadow-xs' : 'text-[#695545]'
              }`}
            >
              Iniciar Sesión (Lector)
            </button>
            <button
              onClick={() => setTab('register')}
              className={`flex-1 py-1.5 rounded transition-all ${
                tab === 'register' ? 'bg-white text-[#2C1E14] shadow-xs' : 'text-[#695545]'
              }`}
            >
              Crear Cuenta Nueva
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label className="font-semibold text-[#5A4738] block mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Sofía Mendoza"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-semibold text-[#5A4738] block mb-1">
                Correo Electrónico (Gmail o personal)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lector@gmail.com o su correo"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#5A4738] block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                <input
                  type="password"
                  required
                  minLength={tab === 'register' ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="font-semibold text-[#5A4738] block mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Repita su contraseña"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#2C1E14]/20 rounded-md focus:ring-1 focus:ring-[#C88A2E]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#2C1E14] hover:bg-[#C88A2E] disabled:opacity-60 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs mt-3 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Conectando...' : tab === 'login' ? 'Entrar a Mi Cuenta de Lector' : 'Registrarme en la Librería'}</span>
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
