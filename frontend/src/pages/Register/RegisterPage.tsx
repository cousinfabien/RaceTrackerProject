import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logos/RaceTracker logo.svg';

import {
  register as registerUser,
  login,
  getMe,
} from '../../services/auth.service';

import { useAuthStore } from '../../store/auth.store';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  role: 'ORGANIZER' | 'DRIVER';
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const loginStore = useAuthStore(
    (state) => state.login,
  );

  const [registerError, setRegisterError] =
    useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: {
      role: 'DRIVER',
    },
  });

  const onSubmit = async (
    data: RegisterForm,
  ) => {
    try {
      setRegisterError('');

      await registerUser(data);

      const authResponse = await login({
        email: data.email,
        password: data.password,
      });

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

      const message =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      if (message === 'User already exists') {
        setRegisterError(
          'An account with this email or username already exists.'
        );
      } else {
        setRegisterError(
          'Unable to create account.'
        );
      }
    };
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
          Create Account
        </h1>

        <p className="mb-8 text-center text-slate-400">
          Join RaceTracker
        </p>

        {registerError && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {registerError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
              {...register('username', {
                required: true,
              })}
            />
            
            <p className="mt-1 text-xs text-slate-400">
              Use the same PlayStation ID as your GT7 account.
            </p>

            {errors.username && (
              <p className="mt-1 text-sm text-red-400">
                Username is required
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
              {...register('password', {
                required: true,
                minLength: 8,
              })}
            />

            {errors.password?.type ===
              'required' && (
              <p className="mt-1 text-sm text-red-400">
                Password is required
              </p>
            )}

            {errors.password?.type ===
              'minLength' && (
              <p className="mt-1 text-sm text-red-400">
                Password must contain at least 8
                characters
              </p>
            )}
          </div>

          <div>
            <select
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
              {...register('role')}
            >
              <option value="DRIVER">
                Driver
              </option>

              <option value="ORGANIZER">
                Organizer
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Creating Account...'
              : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() =>
              navigate('/login')
            }
            className="text-blue-400 hover:text-blue-300"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}