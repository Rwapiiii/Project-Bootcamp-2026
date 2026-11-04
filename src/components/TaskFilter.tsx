"use client";

export type FilterType = "pending" | "missed";

interface TaskFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    pending: number;
    missed: number;
  };
}

export function TaskFilter({
  currentFilter,
  onFilterChange,
  counts,
}: TaskFilterProps) {
  const tabs: { key: FilterType; label: string; count: number; alert?: boolean }[] = [
    { key: "pending", label: "Belum Selesai", count: counts.pending },
    { key: "missed", label: "Miss Deadline", count: counts.missed, alert: counts.missed > 0 },
  ];

  return (
    <div className="flex gap-2 mb-4 border-b border-gray-200 pb-3">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onFilterChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                tab.alert
                  ? "bg-red-500 text-white"
                  : isActive
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
