import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import { getLeague } from '../../services/league-details.service';

interface Race {
  id: number | string;
  track: {
    name: string;
    layout: string;
    country: string;
  };
  raceDate: string;
  laps: number;
}

interface Driver {
  id: number | string;
  user: {
    username: string;
  };
  championshipPoints: number;
}

interface League {
  name: string;
  description: string;
  organizer: {
    username: string;
  };

  regulations: {
    maxPP: number;
    maxPower: number;
    minWeight: number;
    bopEnabled: boolean;
    tuningAllowed: boolean;
    allowedTyres: string[];
  } | null;

  races: Race[];

  _count: {
    drivers: number;
  };

  drivers: Driver[];
}

export default function LeaguePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [league, setLeague] =
    useState<League | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadLeague = async () => {
      try {
        const data = await getLeague(
          Number(id),
        );

        setLeague(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLeague();
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );
  }

  if (!league) {
    return (
      <AppLayout>
        <div>League not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section>
          <h1 className="mb-2 text-4xl font-bold">
            {league.name}
          </h1>

          <p className="mb-4 text-slate-300">
            {league.description}
          </p>

          <p className="text-sm text-slate-400">
            Organizer:{' '}
            {league.organizer.username}
          </p>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Regulations
          </h2>

          {league.regulations ? (
            <div className="space-y-2">
              <p>
                PP Limit:{' '}
                {league.regulations.maxPP}
              </p>

              <p>
                Power Limit:{' '}
                {league.regulations.maxPower} hp
              </p>

              <p>
                Minimum Weight:{' '}
                {league.regulations.minWeight} kg
              </p>

              <p>
                BoP:{' '}
                {league.regulations.bopEnabled
                  ? 'Enabled'
                  : 'Disabled'}
              </p>

              <p>
                Tuning:{' '}
                {league.regulations
                  .tuningAllowed
                  ? 'Allowed'
                  : 'Prohibited'}
              </p>

              <div>
                <p>Allowed Tyres:</p>

                <ul className="ml-5 list-disc">
                  {league.regulations.allowedTyres.map(
                    (
                      tyre: string,
                    ) => (
                      <li key={tyre}>
                        {tyre}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-400">
                No regulations configured yet.
              </p>

            <button
              onClick={() =>
              navigate(`/league/${id}/regulations`)
             }
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
            >
              Configure Regulations
            </button>
          </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Calendar
          </h2>

          {league.races.length === 0 ? (
            <div className="space-y-4">
              <p className="text-slate-400">
                No races scheduled yet.
              </p>

              <button
                onClick={() =>
                  navigate(`/league/${id}/races/create`)
                }
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
              >
                Add Race
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {league.races.map(
                (
                  race: Race,
                  index: number,
                ) => (
                  <div
                    key={race.id}
                    className="rounded-lg border border-slate-700 bg-slate-900 p-4"
                  >
                    <h3 className="mb-2 text-xl font-bold">
                      Round {index + 1}
                    </h3>

                    <p>
                      {race.track.name}
                    </p>

                    <p className="text-slate-400">
                      {
                        race.track
                          .layout
                      }
                    </p>

                    <p className="text-slate-400">
                      {
                        race.track
                          .country
                      }
                    </p>

                    <p className="mt-2">
                      {new Date(
                        race.raceDate,
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      {race.laps} laps
                    </p>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Participants (
            {league._count.drivers})
          </h2>

          {league.drivers.length === 0 ? (
            <p className="text-slate-400">
              No participants registered
              yet.
            </p>
          ) : (
            <div className="space-y-3">
              {league.drivers.map(
                (
                  driver: Driver,
                ) => (
                  <div
                    key={driver.id}
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 p-4"
                  >
                    <span>
                      {
                        driver.user
                          .username
                      }
                    </span>

                    <span className="text-slate-400">
                      {
                        driver.championshipPoints
                      }{' '}
                      pts
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
