import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import { getAllLeagues } from '../../services/league.service';

interface League {
  id: number;
  name: string;
  description: string;
  organizer: {
    username: string;
  };

  _count: {
    drivers: number;
    races: number;
  };
}

export default function BrowseLeaguesPage() {
  const navigate = useNavigate();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const data = await getAllLeagues();

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
        <h1 className="mb-6 text-4xl font-bold">
          Browse Championships
        </h1>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4">
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() =>
                  navigate(`/league/${league.id}`)
                }
                className="rounded-xl border border-slate-700 bg-slate-800 p-6 text-left transition hover:border-blue-500 hover:bg-slate-700"
              >
                <h2 className="text-2xl font-bold">
                  {league.name}
                </h2>

                <p className="mt-2 text-slate-400">
                  {league.description}
                </p>

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
      </div>
    </AppLayout>
  );
}
