import { useAuthStore } from '../../store/auth.store';

export default function TopBar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex items-center justify-between border-b border-white/20 px-4 py-2">
      <button>
        <img
          src="/src/assets/logos/RaceTracker logo compact alt.svg"
          alt="RaceTracker"
          className="h-12"
        />
      </button>

      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black">
        {user?.username?.charAt(0)}
      </button>
    </header>
  );
}