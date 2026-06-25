import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { login, getMe } from '../../services/auth.service';
import { useAuthStore } from '../../store/auth.store';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();

  const loginStore = useAuthStore((state) => state.login);

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

  const isErrorWithResponse = (value: unknown): value is ErrorWithResponse =>
    typeof value === 'object' &&
    value !== null &&
    'response' in value;

  const onSubmit = async (data: LoginForm) => {
    try {
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
        console.error(error.response?.data);
        alert(
          JSON.stringify(
            error.response?.data ??
              (error instanceof Error ? error.message : String(error)),
            null,
            2,
          ),
        );
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(JSON.stringify(error, null, 2));
      }
    }
  };

  return (
    <div>
      <h1>RaceTracker Login</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: true,
            })}
          />

          {errors.email && (
            <p>Email is required</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: true,
            })}
          />

          {errors.password && (
            <p>Password is required</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
