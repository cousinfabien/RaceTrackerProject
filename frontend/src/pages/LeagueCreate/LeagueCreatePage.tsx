import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import { createLeague } from '../../services/create-league.service';

interface CreateLeagueForm {
  name: string;
  description: string;
}

export default function LeagueCreatePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeagueForm>();

  const onSubmit = async (
    data: CreateLeagueForm,
  ) => {
    try {
      const league = await createLeague(data);

      navigate(`/league/${league.id}`);
    } catch (error) {
      console.error(error);

      alert('Unable to create league');
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-4xl font-bold">
          Create League
        </h1>

        <p className="mb-8 text-slate-400">
          Create a new championship and start
          building your calendar.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-xl border border-slate-700 bg-slate-800 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              League Name
            </label>

            <input
              type="text"
              placeholder="TwinCup Series"
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
              {...register('name', {
                required: true,
              })}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-400">
                League name is required
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              placeholder="Describe your championship..."
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-blue-500"
              {...register('description')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Creating...'
              : 'Create League'}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
