import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const syncWithMongo = async (user) => {
        const token = await user.getIdToken();
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/firebase-login`, { token });
    };

    const signUpWithGoogle = async () => {
        setAuthing(true);
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            await syncWithMongo(result.user);
            navigate('/');
        } catch (err) {
            console.error(err);
            setAuthing(false);
        }
    };

    const signUpWithEmail = async () => {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setAuthing(true);
        setError('');
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await syncWithMongo(result.user);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message);
            setAuthing(false);
        }
    };

    return (
        <div className='min-h-screen w-full flex bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-900'>
            {/* Left side - Hero Section */}
            <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm'></div>
                <div className='relative z-10 flex flex-col items-center justify-center p-12 text-white'>
                    <div className='w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mb-8 shadow-2xl'>
                        <svg className='w-16 h-16' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
                        </svg>
                    </div>
                    <h1 className='text-5xl font-bold mb-4 text-center bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent'>
                        Join Us Today
                    </h1>
                    <p className='text-xl text-center text-gray-300 max-w-md leading-relaxed'>
                        Create your account and become part of our growing community. Your journey starts here.
                    </p>
                    <div className='mt-12 flex space-x-2'>
                        <div className='w-3 h-3 rounded-full bg-emerald-400 animate-pulse'></div>
                        <div className='w-3 h-3 rounded-full bg-teal-400 animate-pulse delay-100'></div>
                        <div className='w-3 h-3 rounded-full bg-green-400 animate-pulse delay-200'></div>
                    </div>
                </div>
                <div className='absolute top-0 right-0 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob'></div>
                <div className='absolute top-0 left-0 w-40 h-40 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000'></div>
                <div className='absolute bottom-0 left-20 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000'></div>
            </div>

            {/* Right side - Register Form */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12'>
                <div className='w-full max-w-md'>
                    {/* Mobile header */}
                    <div className='lg:hidden text-center mb-8'>
                        <div className='w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-xl'>
                            <svg className='w-10 h-10 text-white' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z' />
                            </svg>
                        </div>
                        <h2 className='text-3xl font-bold text-white mb-2'>Join Us Today</h2>
                    </div>

                    <div className='bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20'>
                        <div className='hidden lg:block text-center mb-8'>
                            <h2 className='text-3xl font-bold text-white mb-2'>Create Account</h2>
                            <p className='text-gray-300'>Please fill in your information to get started</p>
                        </div>

                        <form className='space-y-6'>
                            <div className='relative'>
                                <input
                                    type='email'
                                    placeholder='Email Address'
                                    className='w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                                    </svg>
                                </div>
                            </div>

                            <div className='relative'>
                                <input
                                    type='password'
                                    placeholder='Password'
                                    className='w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                    </svg>
                                </div>
                            </div>

                            <div className='relative'>
                                <input
                                    type='password'
                                    placeholder='Confirm Password'
                                    className='w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <div className='absolute inset-y-0 right-0 pr-4 flex items-center'>
                                    <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                    </svg>
                                </div>
                            </div>

                            {error && (
                                <div className='bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm backdrop-blur-sm'>
                                    {error}
                                </div>
                            )}

                            <button
                                type='button'
                                onClick={signUpWithEmail}
                                disabled={authing}
                                className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
                            >
                                {authing ? (
                                    <div className='flex items-center justify-center'>
                                        <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                                            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                        </svg>
                                        Creating Account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-white/20'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-4 bg-transparent text-gray-400'>or continue with</span>
                                </div>
                            </div>

                            <button
                                type='button'
                                onClick={signUpWithGoogle}
                                disabled={authing}
                                className='w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center'
                            >
                                <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                                    <path fill='#4285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                                    <path fill='#34A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                                    <path fill='#FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                                    <path fill='#EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                                </svg>
                                Continue with Google
                            </button>
                        </form>

                        <div className='mt-8 text-center'>
                            <p className='text-gray-400'>
                                Already have an account?{' '}
                                <a href='/login' className='text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200'>
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Register;