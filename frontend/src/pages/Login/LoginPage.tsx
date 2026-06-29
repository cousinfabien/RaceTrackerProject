import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import logo from '../../assets/logos/RaceTracker logo.svg';

import { login, getMe } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

  const user = useAuthStore((state) => state.user);

  const [loginError, setLoginError] = useState('');

  useEffect(() => {
  if (user) {
    navigate('/');
  }
}, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  type ErrorWithResponse = {
    response?: {
      data?: unknown;
    };
  };

  const isErrorWithResponse = (
    value: unknown,
  ): value is ErrorWithResponse =>
    typeof value === 'object' &&
    value !== null &&
    'response' in value;

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoginError('');

      const authResponse = await login(data);

      localStorage.setItem(
        'token',
        authResponse.access_token,
      );

      const user = await getMe();

      loginStore(
        authResponse.access_token,
        user,
      );

      navigate('/');
    } catch (error: unknown) {
      console.error(error);

      if (isErrorWithResponse(error)) {
        setLoginError('Invalid credentials');
      } else {
        setLoginError('Network error');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-xl">
        <img
          src={logo}
          alt="RaceTracker"
          className="mx-auto mb-6 h-20"
        />

        <h1 className="mb-2 text-center text-3xl font-bold text-white">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-slate-400">
          Sign in to continue to RaceTracker
        </p>

        {loginError && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {loginError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              {...register('email', {
                required: true,
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                Email is required
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              {...register('password', {
                required: true,
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                Password is required
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Signing In...'
              : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-400 hover:text-blue-300"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
