import { Dispatch, SetStateAction } from "react";

interface ListingsTabsProps {
  filterStatus: string;
  setFilterStatus: Dispatch<SetStateAction<string>>;
}

const ListingsTabs = ({ filterStatus, setFilterStatus }: ListingsTabsProps) => {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {[
        { key: "all", label: "همه" },
        { key: "active", label: "منتشر شده" },
        { key: "pending", label: "در انتظار" },
        { key: "rejected", label: "رد شده" },
        { key: "sold", label: "فروخته شده" },
      ].map((filter) => (
        <button
          key={filter.key}
          onClick={() => setFilterStatus(filter.key)}
          className={`px-4 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            filterStatus === filter.key
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default ListingsTabs;
