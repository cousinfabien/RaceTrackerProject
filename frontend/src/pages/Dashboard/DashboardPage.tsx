import { useEffect, useState } from 'react';

import AppLayout from '../../components/layout/AppLayout';

import { useAuthStore } from '../../store/auth.store';

import { useNavigate } from 'react-router-dom';

import {
  getMyLeagues,
  type League,
} from '../../services/league.service';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const data = await getMyLeagues();

        setLeagues(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadLeagues();
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">
            Welcome back, {user?.username}
          </h1>

          <p className="text-slate-300">
            Manage your leagues and championships.
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate('/create-league')}
            className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:bg-slate-700"
          >
            <h2 className="mb-2 text-xl font-semibold">
              Create League
            </h2>

            <p className="text-slate-400">
              Start a new championship.
            </p>
          </button>

          <button
            className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-left opacity-50"
          >
            <h2 className="mb-2 text-xl font-semibold">
              Join League
            </h2>

            <p className="text-slate-400">
              Coming soon
            </p>
          </button>
        </div>

        <section>
          <h2 className="mb-4 text-2xl font-bold">
            My Leagues ({leagues.length})
          </h2>

          {loading ? (
            <div className="rounded-xl bg-slate-800 p-6">
              Loading...
            </div>
          ) : leagues.length === 0 ? (
            <div className="rounded-xl bg-slate-800 p-6">
              No leagues found.
            </div>
          ) : (
            <div className="grid gap-4">
              {leagues.map((league) => (
                <button
                  key={league.id}
                  onClick={() => navigate(`/league/${league.id}`)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:border-blue-500 hover:bg-slate-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {league.name}
                      </h3>

                      <p className="mt-2 text-slate-400">
                        {league.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-6 text-sm text-slate-300">
                    <span>
                      👤 {league._count.drivers} drivers
                    </span>

                    <span>
                      🏁 {league._count.races} races
                    </span>
                  </div>

                  <div className="mt-4 text-sm text-slate-500">
                    Organizer: {league.organizer.username}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
