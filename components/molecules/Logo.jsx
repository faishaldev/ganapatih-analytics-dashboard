import { ChartArea } from 'lucide-react';

export default function Logo() {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        hover:cursor-pointer
        hover:scale-105
        active:scale-100
        duration-150
        border
        p-1
        rounded-lg"
    >
      <ChartArea color="white" />
      <h1 className="text-white text-xl font-bold tracking-widest">
        GANAPATIH ANALYTICS DASHBOARD
      </h1>
    </div>
  );
}
