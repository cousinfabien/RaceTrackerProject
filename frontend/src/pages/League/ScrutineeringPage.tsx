import { useState } from 'react';
import { useParams } from 'react-router-dom';

import AppLayout from '../../components/layout/AppLayout';

import {
  uploadScreenshot,
  analyzeScreenshot,
} from '../../services/scrutineering.service';

type ScrutineeringResult = {
  detectedSetup: {
    currentPP: number;
    currentPower: number;
    currentWeight: number;
    tyres: string;
  };
  compliant: boolean;
  errors: string[];
};

export default function ScrutineeringPage() {
  const { id } = useParams();

  const [file, setFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<ScrutineeringResult | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      return;
    }

    try {
      setLoading(true);

      const upload =
        await uploadScreenshot(file);

      const analysis =
        await analyzeScreenshot(
          Number(id),
          upload.filename,
        );

      setResult(analysis);
    } catch (error) {
      console.error(error);

      alert(
        'Unable to analyze screenshot.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">

        <h1 className="text-4xl font-bold">
          Scrutineering
        </h1>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">

          <p className="mb-4 text-slate-300">
            Upload a screenshot from
            the GT7 garage screen.
          </p>

          <div className="rounded-xl border border-dashed border-slate-600 p-6 text-center">
    <input
        id="screenshot-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
        setFile(
            e.target.files?.[0] ?? null,
        )
        }
    />

    <label
        htmlFor="screenshot-upload"
        className="inline-block cursor-pointer rounded-lg bg-slate-700 px-4 py-2 font-medium transition hover:bg-slate-600"
    >
        Choose Screenshot
    </label>

    {file ? (
        <p className="mt-3 text-sm text-green-400">
            ✓ {file.name}
        </p>
        ) : (
            <p className="mt-3 text-sm text-slate-400">
                PNG or JPG screenshot from GT7
            </p>
        )}
    </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 disabled:opacity-50"
          >
            {loading
              ? 'Analyzing...'
              : 'Analyze Vehicle'}
          </button>
        </div>

        {result && (
          <>
            <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">

              <h2 className="mb-4 text-2xl font-bold">
                Detected Setup
              </h2>

              <div className="space-y-2">
                <p>
                  PP:{' '}
                  {
                    result.detectedSetup
                      .currentPP
                  }
                </p>

                <p>
                  Power:{' '}
                  {
                    result.detectedSetup
                      .currentPower
                  }{' '}
                  hp
                </p>

                <p>
                  Weight:{' '}
                  {
                    result.detectedSetup
                      .currentWeight
                  }{' '}
                  kg
                </p>

                <p>
                  Tyres:{' '}
                  {
                    result.detectedSetup
                      .tyres
                  }
                </p>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 ${
                result.compliant
                  ? 'border border-green-700 bg-green-950'
                  : 'border border-red-700 bg-red-950'
              }`}
            >
              {result.compliant ? (
                <>
                  <h2 className="text-2xl font-bold text-green-400">
                    ✅ Vehicle Compliant
                  </h2>

                  <p className="mt-2 text-green-300">
                    Your vehicle respects
                    the championship
                    regulations.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-red-400">
                    ❌ Vehicle Not
                    Compliant
                  </h2>

                  <ul className="mt-4 list-disc space-y-2 pl-5">
                    {result.errors.map(
                      (
                        error: string,
                      ) => (
                        <li key={error}>
                          {error}
                        </li>
                      ),
                    )}
                  </ul>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
