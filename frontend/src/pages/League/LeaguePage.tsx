import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

import AppLayout from '../../components/layout/AppLayout';

import { getLeague } from '../../services/league-details.service';
import { joinLeague } from '../../services/driver.service';
import axios from 'axios';
import { getStandings } from '../../services/standings.service';
import { getDriverResults } from '../../services/results.service';
import { getTitleStatus } from '../../services/results.service';

interface Race {
  id: number | string;

  track: {
    id: number;
    name: string;
    layout: string;
    country: string;
  };

  raceDate: string;
  laps: number;

  qualifyingFuelConsumption: number;
  raceFuelConsumption: number;

  qualifyingTyreWear: number;
  raceTyreWear: number;
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
    id: number
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

interface Standing {
  rank: number;
  points: number;
  driverEntryId: number;

  user: {
    id: number;
    username: string;
  };

  carSetup?: {
    vehicleModel?: {
      name: string;
    };
  };
}

interface DriverResult {
  [key: string]: unknown;
}

interface TitleStatus {
  stillInContention: boolean;
  [key: string]: unknown;
}

export default function LeaguePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const [expandedDriver, setExpandedDriver] =
    useState<number | null>(null);
  
  const [driverResults, setDriverResults] =
    useState<Record<number, DriverResult[]>>({});

  const [league, setLeague] =
    useState<League | null>(null);

  

  const [standings, setStandings] =
  useState<Standing[]>([]);

  const isOrganizer = user?.id === league?.organizer.id;

  const [loading, setLoading] =
    useState(true);
  const [joining, setJoining] =
    useState(false);


  const [titleStatus, setTitleStatus] =
    useState<Record<number, TitleStatus>>({});


const handleJoinLeague = async () => {
  try {
    setJoining(true);

    await joinLeague(Number(id));

    const updatedLeague =
      await getLeague(Number(id));

    setLeague(updatedLeague);

    alert(
      'Successfully joined championship!',
    );
  } catch (error) {
    console.error(error);

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409
    ) {
      alert(
        'You are already registered.'
      );

      return;
    }

    alert(
      'Unable to join championship.'
    );
  } finally {
    setJoining(false);
  }
};

const handleDriverClick = async (
  entry: Standing,
) => {
  if (
    expandedDriver ===
    entry.driverEntryId
  ) {
    setExpandedDriver(null);
    return;
  }

  setExpandedDriver(
    entry.driverEntryId,
  );

  if (
    driverResults[
      entry.driverEntryId
    ]
  ) {
    return;
  }

  try {
    const results =
      await getDriverResults(
        entry.driverEntryId,
      );
    
    const status =
      await getTitleStatus(
      Number(id),
      entry.driverEntryId,
    );

    setTitleStatus((prev) => ({
      ...prev,
      [entry.driverEntryId]: status,
    }));

    setDriverResults((prev) => ({
      ...prev,
      [entry.driverEntryId]:
        results,
    }));
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    const loadLeague = async () => {
      try {
        const data = await getLeague(
          Number(id),
        );
        setLeague(data);

       const standingsData =
        await getStandings(Number(id));

            setStandings(standingsData);

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
          <div className="mt-4">
        <button
          onClick={handleJoinLeague}
          disabled={joining}
          className="rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-500 disabled:opacity-50"
        >
          {joining
            ? 'Joining...'
            : 'Join Championship'}
          </button>
          </div>
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

            {isOrganizer && (
              <button
                onClick={() => 
                  navigate(`/league/${id}/regulations`)
                }
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
                >
                  Configure Regulations
                </button>
            )}
          </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Calendar
          </h2>

          {isOrganizer && (
          <button
            onClick={() =>
            navigate(`/league/${id}/races/create`)
            }
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
          >
            Add Race
          </button>
          )}
        </div>

          {league.races.length === 0 ? (
          <p className="text-slate-400">
            No races scheduled yet.
          </p>
            ) : (
          <div className="space-y-4">
            {league.races.map(
          (
            race: Race,
            index: number,
          ) => (
            <div
              key={race.id}
              className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900"
            >
              <img
                src={`/tracks/${race.track.id}.png`}
                alt={race.track.name}
                onError={(e) => {
                  e.currentTarget.src =
                    '/tracks/default.png';
                }}
                  className="h-40 w-full bg-slate-950 object-contain"
              />

              <div className="p-4">
                <h3 className="mb-2 text-xl font-bold">
                  Round {index + 1}
                </h3>

                <p className="font-medium">
                  {race.track.name}
                </p>

                <p className="text-slate-400">
                  {race.track.layout}
                </p>

                <p className="text-slate-400">
                  {race.track.country}
                </p>

                <p className="mt-2">
                  {new Date(
                    race.raceDate,
                  ).toLocaleDateString()}
                </p>

                <p>
                  {race.laps} laps
                </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-300">
                      <div>
                        ⛽ Qualifying Fuel:
                        {' '}
                        x{
                          race.qualifyingFuelConsumption
                        }
                      </div>

                      <div>
                        ⛽ Race Fuel:
                        {' '}
                        x{
                          race.raceFuelConsumption
                        }
                      </div>

                      <div>
                        🛞 Qualifying Tyres:
                        {' '}
                        x{
                          race.qualifyingTyreWear
                        }
                      </div>

                      <div>
                       🛞 Race Tyres:
                        {' '}
                        x{
                        race.raceTyreWear
                        }
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/race/${race.id}/results`,
                          )
                        }
                        className="rounded-lg bg-slate-700 px-4 py-2 font-medium hover:bg-slate-600"
                      >
                        View Results
                      </button>

                      {isOrganizer && (
                        <button
                          onClick={() =>
                            navigate(
                            `/races/${race.id}/results/create`,
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500"
                      >
                        Enter Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}

            <button
              onClick={() =>
              navigate(
                `/league/${id}/scrutineering`,
              )
            }
              className="rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-500"
            >
              Submit Car For Scrutineering
            </button>
          </div>
        )}
      </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h2 className="mb-4 text-2xl font-bold">
            Championship Standings
          </h2>

          {standings.length === 0 ? (
            <p className="text-slate-400">
              No results entered yet.
            </p>
          ) : (
          <div className="space-y-3">
            {standings.map((entry: Standing) => {
              const entryTitleStatus =
                titleStatus[entry.driverEntryId];
              const status = entryTitleStatus?.status;

              return (
                <div
                  key={entry.user.id}
                  className="rounded-lg border border-slate-700 bg-slate-900"
                >
                  <button
                    onClick={() =>
                      handleDriverClick(entry)
                    }
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div>
                      <p className="font-bold">
                        #{entry.rank}{' '}
                        {entry.user.username}
                      </p>

                      <p className="text-sm text-slate-400">
                        {entry.carSetup
                          ?.vehicleModel?.name ??
                          'No car submitted'}
                      </p>
                    </div>

                    <span className="text-lg font-bold">
                      {entry.points} pts
                    </span>
                  </button>

                  {expandedDriver ===
                    entry.driverEntryId && (
                    <div className="border-t border-slate-700 p-4">
                      {entryTitleStatus && (
                        <div
                          className={`mb-4 rounded-lg p-3 ${
                            status === 'eliminated'
                              ? 'bg-red-900 text-red-200'
                              : 'bg-green-900 text-green-200'
                          }`}
                        >
                          {status === 'champion' && (
                            <div className="mb-4 rounded-lg bg-yellow-900 p-3 text-yellow-200">
                              🏆 Champion
                            </div>
                          )}

                          {status === 'contender' && (
                            <div className="mb-4 rounded-lg bg-green-900 p-3 text-green-200">
                              🟢 Still in Championship Contention
                            </div>
                          )}

                          {status === 'eliminated' && (
                            <div className="mb-4 rounded-lg bg-red-900 p-3 text-red-200">
                              🔴 Mathematically Eliminated
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-3">
                        {(
                          driverResults[
                            entry.driverEntryId
                          ] as Array<{
                            id: number;
                            position: number;
                            points: number;
                            fastestLap: boolean;
                            race: {
                              track: {
                                name: string;
                              };
                            };
                          }>
                        )?.map((result) => (
                          <div
                            key={result.id}
                            className="rounded-lg border border-slate-700 bg-slate-800 p-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {result.race.track.name}
                              </span>

                              <span className="font-bold">
                                P{result.position}
                              </span>
                            </div>

                            <div className="mt-1 text-sm text-slate-400">
                              {result.points} pts
                              {result.fastestLap &&
                                ' • Fastest Lap'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
    </div>
    )}
   </section>
  </div>
</AppLayout>
);
}
