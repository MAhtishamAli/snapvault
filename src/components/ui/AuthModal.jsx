import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, X, ArrowRight, ShieldCheck, MailWarning } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function AuthModal() {
    const { showAuthModal, setShowAuthModal, authModalView, setAuthModalView, login, signup } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const closeModal = () => {
        if (!loading) setShowAuthModal(false);
    };

    const handleAction = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            if (authModalView === 'login') {
                await login(email, password);
                closeModal();
            } else if (authModalView === 'signup') {
                await signup(name, email, password);
                closeModal();
            } else if (authModalView === 'forgot') {
                await axios.post(`${API_URL}/auth/forgot-password`, { email });
                setSuccessMessage('Verification code sent if email exists.');
                setTimeout(() => setAuthModalView('reset'), 2000);
            } else if (authModalView === 'reset') {
                await axios.post(`${API_URL}/auth/reset-password`, { email, code, newPassword: password });
                setSuccessMessage('Password reset successfully! You can now log in.');
                setTimeout(() => setAuthModalView('login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!showAuthModal) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-surface rounded-2xl border border-border overflow-hidden shadow-2xl relative"
            >
                <div className="p-6">
                    <button onClick={closeModal} className="absolute top-4 right-4 text-text-muted hover:text-text-primary p-2 rounded-xl hover:bg-hover-overlay transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8 pt-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-primary-glow">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                            {authModalView === 'login' && 'Welcome Back'}
                            {authModalView === 'signup' && 'Create Account'}
                            {authModalView === 'forgot' && 'Reset Password'}
                            {authModalView === 'reset' && 'Enter Code'}
                        </h2>
                        <p className="text-sm text-text-muted mt-2">
                            {authModalView === 'login' && 'Sign in to access your secure vault.'}
                            {authModalView === 'signup' && 'Sign up to protect your sensitive recordings.'}
                            {authModalView === 'forgot' && 'We will send a code to your email.'}
                            {authModalView === 'reset' && 'Enter the verification code and new password.'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 mb-6 bg-crimson/10 border border-crimson/30 rounded-xl text-crimson text-sm text-center">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="p-3 mb-6 bg-emerald/10 border border-emerald/30 rounded-xl text-emerald text-sm text-center">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleAction} className="space-y-4">
                        {authModalView === 'signup' && (
                            <div>
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-text-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-surface-raised border border-border rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-text-primary placeholder:-text-muted"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        {(authModalView === 'login' || authModalView === 'signup' || authModalView === 'forgot' || authModalView === 'reset') && (
                            <div>
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-text-muted" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-surface-raised border border-border rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-text-primary placeholder:-text-muted"
                                        placeholder="you@company.com"
                                    />
                                </div>
                            </div>
                        )}

                        {authModalView === 'reset' && (
                            <div>
                                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 block">Verification Code</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailWarning className="h-4 w-4 text-text-muted" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full bg-surface-raised border border-border rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-text-primary placeholder:-text-muted text-center tracking-widest"
                                        placeholder="123456"
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        )}

                        {(authModalView === 'login' || authModalView === 'signup' || authModalView === 'reset') && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                                        {authModalView === 'reset' ? 'New Password' : 'Password'}
                                    </label>
                                    {authModalView === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setAuthModalView('forgot')}
                                            className="text-xs text-primary hover:text-primary/80 font-medium"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-text-muted" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-surface-raised border border-border rounded-xl py-2.5 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-text-primary placeholder:-text-muted"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (
                                <>
                                    {authModalView === 'login' && 'Sign In'}
                                    {authModalView === 'signup' && 'Create Account'}
                                    {authModalView === 'forgot' && 'Send Code'}
                                    {authModalView === 'reset' && 'Reset Password'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-text-muted">
                        {authModalView === 'login' && (
                            <p>Don't have an account? <button onClick={() => setAuthModalView('signup')} className="text-primary hover:underline font-semibold">Sign up</button></p>
                        )}
                        {authModalView === 'signup' && (
                            <p>Already have an account? <button onClick={() => setAuthModalView('login')} className="text-primary hover:underline font-semibold">Sign in</button></p>
                        )}
                        {(authModalView === 'forgot' || authModalView === 'reset') && (
                            <p>Remembered your password? <button onClick={() => setAuthModalView('login')} className="text-primary hover:underline font-semibold">Sign in</button></p>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
