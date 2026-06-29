import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import {
  createRace,
  type CreateRaceDto,
} from '../../services/race.service';

import {
  getTracks,
  type Track,
} from '../../services/track.service';

export default function RaceCreatePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [tracks, setTracks] = useState<Track[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateRaceDto>();

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const tracksData = await getTracks();

        setTracks(tracksData);
      } catch (error) {
        console.error(error);
      }
    };

    loadTracks();
  }, []);

  const onSubmit = async (data: CreateRaceDto) => {
    try {
      await createRace(
        Number(id),
        {
          ...data,

          raceDate: new Date(
            data.raceDate,
          ).toISOString(),

          trackId: Number(data.trackId),
          laps: Number(data.laps),

          qualifyingFuelConsumption:
            Number(data.qualifyingFuelConsumption),

          raceFuelConsumption:
            Number(data.raceFuelConsumption),

          qualifyingTyreWear:
            Number(data.qualifyingTyreWear),

          raceTyreWear:
            Number(data.raceTyreWear),
        },
      );

      navigate(`/league/${id}`);
    } catch (error) {
      console.error(error);

      alert('Failed to create race');
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold">
          Add Race
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block">
              Track
            </label>

            <select
              {...register('trackId', {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            >
              <option value="">
                Select a track
              </option>

              {tracks.map((track) => (
                <option
                  key={track.id}
                  value={track.id}
                >
                  {track.name} (
                  {track.layout})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block">
              Race Date
            </label>

            <input
              type="datetime-local"
              {...register('raceDate')}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block">
              Laps
            </label>

            <input
              type="number"
              {...register('laps', {
                valueAsNumber: true,
              })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              placeholder="Qualifying Fuel"
              {...register(
                'qualifyingFuelConsumption',
                {
                  valueAsNumber: true,
                },
              )}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            <input
              type="number"
              placeholder="Race Fuel"
              {...register(
                'raceFuelConsumption',
                {
                  valueAsNumber: true,
                },
              )}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            <input
              type="number"
              placeholder="Qualifying Tyre Wear"
              {...register(
                'qualifyingTyreWear',
                {
                  valueAsNumber: true,
                },
              )}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            />

            <input
              type="number"
              placeholder="Race Tyre Wear"
              {...register(
                'raceTyreWear',
                {
                  valueAsNumber: true,
                },
              )}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
          >
            Create Race
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
