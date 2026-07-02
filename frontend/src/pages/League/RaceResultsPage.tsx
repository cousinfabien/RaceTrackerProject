import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import { getRaceResults } from '../../services/results.service';

interface Result {
  id: number;
  position: number;
  points: number;
  fastestLap: boolean;
  driverEntry: {
    id: number;
    user: {
      username: string;
    };
  };
}

export default function RaceResultsPage() {
  const { id } = useParams();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      try {
        if (!id) {
          return;
        }

        const data = await getRaceResults(Number(id));

        if (isMounted) {
          setResults(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div>Loading...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold">Race Results</h1>

        {results.length === 0 ? (
          <p className="text-slate-400">No results entered yet.</p>
        ) : (
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div>
                  <p className="font-bold">P{result.position}</p>

                  <p>{result.driverEntry.user.username}</p>
                </div>

                <div className="text-right">
                  <p>{result.points} pts</p>

                  {result.fastestLap && (
                    <p className="text-purple-400">Fastest Lap</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
