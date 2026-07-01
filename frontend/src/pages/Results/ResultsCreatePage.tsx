import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import { getRace } from '../../services/race.service';
import {
  getLeagueDrivers,
} from '../../services/driver.service';
import {
  createResult,
} from '../../services/results.service';

interface Driver {
  id: number;

  user: {
    username: string;
  };
}

export default function ResultsCreatePage() {
  const { raceId } = useParams();

  const navigate = useNavigate();


  const [results, setResults] = useState<
    {
      driverEntryId: number;
      username: string;
      position: string;
      points: string;
      fastestLap: boolean;
    }[]
  >([]);


  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const race = await getRace(
          Number(raceId),
        );

        const leagueId =
          race.leagueId;

        const driversData =
          await getLeagueDrivers(
            leagueId,
          );

        setResults(
          driversData.map(
            (driver: Driver) => ({
              driverEntryId: driver.id,
              username:
                driver.user.username,
              position: '',
              points: '',
              fastestLap: false,
            }),
          ),
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [raceId]);

  const handleSaveResults =
  async () => {
    try {
      setLoading(true);

      for (const result of results) {
        if (!result.position) {
          continue;
        }

        await createResult(
          Number(raceId),
          {
            driverEntryId:
              result.driverEntryId,

            position: Number(
              result.position,
            ),

            points: Number(
              result.points,
            ),

            fastestLap:
              result.fastestLap,
          },
        );
      }

      alert(
        'Results saved successfully',
      );

      navigate(-1);
    } catch (error) {
      console.error(error);

      alert(
        'Unable to save results',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl rounded-xl border border-slate-700 bg-slate-800 p-6">

        <h1 className="mb-6 text-3xl font-bold">
          Enter Race Result
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 text-left">
                  Driver
                </th>

                <th className="p-3 text-left">
                  Position
                </th>

                <th className="p-3 text-left">
                  Points
                </th>

                <th className="p-3 text-left">
                  Fastest Lap
                </th>
              </tr>
            </thead>

            <tbody>
              {results.map(
                (result, index) => (
                  <tr
                    key={result.driverEntryId}
                    className="border-b border-slate-800"
                  >
                    <td className="p-3">
                      {result.username}
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        min={1}
                        value={result.position}
                        onChange={(e) => {
                          const updated = [
                            ...results,
                          ];

                          updated[index].position =
                          e.target.value;

                          setResults(updated);
                        }}
                        className="w-24 rounded bg-slate-900 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="number"
                        min={0}
                        value={result.points}
                        onChange={(e) => {
                          const updated = [
                            ...results,
                          ];

                          updated[index].points =
                          e.target.value;

                          setResults(updated);
                        }}
                        className="w-24 rounded bg-slate-900 p-2"
                      />
                    </td>

                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={
                          result.fastestLap
                        }
                        onChange={(e) => {
                          const updated = [
                            ...results,
                          ];

                          updated[
                            index
                          ].fastestLap =
                          e.target.checked;

                          setResults(updated);
                        }}
                      />
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSaveResults}
          disabled={loading}
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          {loading
            ?'Saving...'
            : 'Save Results'}
        </button>
      </div>
    </AppLayout>
  );
}
