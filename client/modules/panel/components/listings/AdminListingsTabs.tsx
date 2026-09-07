import { Dispatch, SetStateAction } from "react";

interface AdminListingsTabsProps {
  filterStatus: string;
  setFilterStatus: Dispatch<SetStateAction<string>>;
}

const AdminListingsTabs = ({ filterStatus, setFilterStatus }: AdminListingsTabsProps) => {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
      {[
        { key: "pending", label: "در انتظار تایید" },
        { key: "active", label: "منتشر شده" },
        { key: "rejected", label: "رد شده" },
        { key: "sold", label: "فروخته شده" },
        { key: "all", label: "همه" },
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

export default AdminListingsTabs;
