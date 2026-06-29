import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import {
  createRegulation,
  type CreateRegulationDto,
} from '../../services/regulation.service';

const tyreOptions = [
  'Comfort Soft',
  'Comfort Medium',
  'Comfort Hard',

  'Sports Soft',
  'Sports Medium',
  'Sports Hard',

  'Racing Soft',
  'Racing Medium',
  'Racing Hard',

  'Intermediate',
  'Heavy Wet',
];

export default function LeagueRegulationsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } =
    useForm<CreateRegulationDto>();

  const onSubmit = async (
    data: CreateRegulationDto,
  ) => {
    try {
      const formData = {
        ...data,

        maxPP: Number(data.maxPP),

        maxPower: Number(data.maxPower),

        minWeight: Number(data.minWeight),

        allowedTyres:
          Array.isArray(data.allowedTyres)
            ? data.allowedTyres
            : [data.allowedTyres],
      };

      await createRegulation(
        Number(id),
        formData,
      );

      navigate(`/league/${id}`);
    } catch (error) {
      console.error(error);

      alert(
        'Failed to create regulations',
      );
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">
          Configure Regulations
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block">
              PP Limit
            </label>

            <input
              type="number"
              {...register('maxPP', {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Power Limit (hp)
            </label>

            <input
              type="number"
              {...register('maxPower', {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Minimum Weight (kg)
            </label>

            <input
              type="number"
              {...register('minWeight', {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <p className="mb-3 font-semibold">
              Allowed Tyres
            </p>

            <div className="grid gap-2 md:grid-cols-2">
              {tyreOptions.map(
                (tyre) => (
                  <label
                    key={tyre}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      value={tyre}
                      {...register(
                        'allowedTyres',
                      )}
                    />

                    {tyre}
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register(
                  'bopEnabled',
                )}
              />

              BoP Enabled
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register(
                  'tuningAllowed',
                )}
              />

              Tuning Allowed
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Save Regulations
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
