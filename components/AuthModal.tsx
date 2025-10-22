import React, { useState, useEffect } from 'react';
import { XIcon, UploadCloudIcon, UserIcon } from './Icons';
import { getUsers } from '../services/authService';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignUpData extends LoginCredentials {
    avatar?: File;
    banner?: File;
}

interface AuthModalProps {
  onClose: () => void;
  onLogin: (credentials: LoginCredentials) => Promise<void>;
  onSignUp: (data: SignUpData) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onSignUp }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgotPassword'>('login');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Reset states when view changes
  useEffect(() => {
      setError(null);
      setSuccessMessage(null);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
  }, [view]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
      const file = e.target.files?.[0];
      if (file) {
          const previewUrl = URL.createObjectURL(file);
          if (type === 'avatar') {
              setAvatar(file);
              setAvatarPreview(previewUrl);
          } else {
              setBanner(file);
              setBannerPreview(previewUrl);
          }
      }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try {
          if (view === 'login') {
              if (!username || !password) {
                  throw new Error("Username and password are required.");
              }
              await onLogin({ username, password });
          } else if (view === 'signup') {
              if (password !== confirmPassword) {
                  throw new Error("Passwords do not match.");
              }
              if (!username || !password) {
                  throw new Error("Username and password are required.");
              }
              await onSignUp({ username, password, avatar: avatar || undefined, banner: banner || undefined });
          }
      } catch (err) {
          setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
          setIsLoading(false);
      }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you'd trigger a backend process here.
    // For simulation, we check if the user exists but always show a generic message for security.
    const users = getUsers();
    const userExists = users.find(u => u.name.toLowerCase() === username.toLowerCase());
    
    console.log(`Password reset requested for ${username}. User exists: ${!!userExists}`);
    setSuccessMessage("If an account with that username exists, a password reset link has been sent.");

    setIsLoading(false);
  }
  
  const FileInput: React.FC<{
    id: string;
    label: string;
    previewUrl: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    isAvatar?: boolean;
  }> = ({ id, label, previewUrl, onChange, icon, isAvatar=false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-secondary-dark mb-2">{label}</label>
        <div className={`relative border-2 border-dashed border-gray-600 rounded-lg flex justify-center items-center ${isAvatar ? 'h-24 w-24 rounded-full mx-auto' : 'h-32'}`}>
            {previewUrl ? (
                <img src={previewUrl} alt="Preview" className={`object-cover h-full w-full ${isAvatar ? 'rounded-full' : 'rounded-lg'}`} />
            ) : (
                <div className="text-center p-4">
                    {icon}
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG</p>
                </div>
            )}
            <input id={id} type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".png,.jpg,.jpeg" onChange={onChange} />
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative bg-surface-dark p-6 rounded-lg shadow-2xl w-full max-w-md animate-zoom-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><XIcon /></button>
        
        {view !== 'forgotPassword' && (
            <div className="flex border-b border-gray-700 mb-6">
                <button onClick={() => setView('login')} className={`px-4 py-2 text-lg font-semibold transition-colors ${view === 'login' ? 'border-b-2 border-brand-primary text-white' : 'text-text-secondary-dark'}`}>Login</button>
                <button onClick={() => setView('signup')} className={`px-4 py-2 text-lg font-semibold transition-colors ${view === 'signup' ? 'border-b-2 border-brand-primary text-white' : 'text-text-secondary-dark'}`}>Sign Up</button>
            </div>
        )}

        {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded-md mb-4">{error}</p>}
        {successMessage && <p className="text-green-400 text-sm bg-green-500/10 p-2 rounded-md mb-4">{successMessage}</p>}

        {view === 'forgotPassword' ? (
          <div>
            <h3 className="text-lg font-semibold text-center mb-4">Reset Password</h3>
            <p className="text-sm text-text-secondary-dark text-center mb-6">Enter your username and we'll send you a (simulated) link to reset your password.</p>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                  <label htmlFor="username-reset" className="block text-sm font-medium text-text-secondary-dark">Username</label>
                  <input id="username-reset" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:ring-brand-primary focus:outline-none"/>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white px-4 py-2.5 rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:bg-brand-secondary">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
               <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-blue-400 hover:underline mt-2">
                  Back to Login
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text-secondary-dark">Username</label>
                  <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:ring-brand-primary focus:outline-none"/>
              </div>
              <div>
                  <label htmlFor="password"className="block text-sm font-medium text-text-secondary-dark">Password</label>
                  <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:ring-brand-primary focus:outline-none"/>
              </div>

              {view === 'login' && (
                  <div className="text-right">
                      <button type="button" onClick={() => setView('forgotPassword')} className="text-xs text-blue-400 hover:underline">
                          Forgot Password?
                      </button>
                  </div>
              )}

              {view === 'signup' && (
                  <>
                      <div>
                          <label htmlFor="confirmPassword"className="block text-sm font-medium text-text-secondary-dark">Confirm Password</label>
                          <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-sm focus:ring-brand-primary focus:outline-none"/>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                          <FileInput id="avatar" label="Profile Picture" previewUrl={avatarPreview} onChange={(e) => handleFileChange(e, 'avatar')} icon={<UserIcon />} isAvatar />
                          <FileInput id="banner" label="Profile Banner" previewUrl={bannerPreview} onChange={(e) => handleFileChange(e, 'banner')} icon={<UploadCloudIcon />} />
                      </div>
                  </>
              )}

              <button type="submit" disabled={isLoading} className="w-full bg-brand-primary text-white px-4 py-2.5 rounded-md font-semibold hover:bg-blue-600 transition-colors disabled:bg-brand-secondary">
                  {isLoading ? 'Processing...' : (view === 'login' ? 'Login' : 'Create Account')}
              </button>
          </form>
        )}
      </div>
    </div>
  );
};
