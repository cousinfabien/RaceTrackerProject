import { useEffect, useState } from 'react';

import AppLayout from '../../components/layout/AppLayout';

import { getProfile } from '../../services/profile.service';

interface ProfileData {
  user: {
    id: number;
    username: string;
  };

  stats: {
    championshipsJoined: number;
    raceStarts: number;
    wins: number;
    podiums: number;
    totalPoints: number;
  };

  championships: {
    leagueId: number;
    leagueName: string;
    points: number;
  }[];
}

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data =
          await getProfile();

        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div>Profile not found</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8">

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">
          <h1 className="text-4xl font-bold">
            {profile.user.username}
          </h1>

          <p className="mt-2 text-slate-400">
            Driver Profile
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-5">

          <StatCard
            label="Championships"
            value={
              profile.stats
                .championshipsJoined
            }
          />

          <StatCard
            label="Race Starts"
            value={
              profile.stats.raceStarts
            }
          />

          <StatCard
            label="Wins"
            value={
              profile.stats.wins
            }
          />

          <StatCard
            label="Podiums"
            value={
              profile.stats.podiums
            }
          />

          <StatCard
            label="Points"
            value={
              profile.stats.totalPoints
            }
          />

        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-800 p-6">

          <h2 className="mb-4 text-2xl font-bold">
            Championships
          </h2>

          {profile.championships.length ===
          0 ? (
            <p className="text-slate-400">
              No championships joined yet.
            </p>
          ) : (
            <div className="space-y-3">
              {profile.championships.map(
                (
                  championship,
                ) => (
                  <div
                    key={
                      championship.leagueId
                    }
                    className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900 p-4"
                  >
                    <span>
                      {
                        championship.leagueName
                      }
                    </span>

                    <span className="text-slate-400">
                      {
                        championship.points
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center">
      <div className="text-3xl font-bold">
        {value}
      </div>

      <div className="mt-2 text-sm text-slate-400">
        {label}
      </div>
    </div>
  );
}
