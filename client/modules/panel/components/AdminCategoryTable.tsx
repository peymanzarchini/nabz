import { GetCategory } from "@/modules/home/types";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface AdminCategoryTableProps {
  isLoading: boolean;
  flatCategories: { cat: GetCategory; level: number }[];
  openEditModal: (cat: GetCategory) => void;
  setDeleteTargetId: Dispatch<SetStateAction<string | null>>;
}

const AdminCategoryTable = ({
  isLoading,
  flatCategories,
  openEditModal,
  setDeleteTargetId,
}: AdminCategoryTableProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-sm shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <table className="w-full text-right">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
            <tr>
              <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">
                نام دسته‌بندی
              </th>
              <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">اسلاگ</th>
              <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">آیکون</th>
              <th className="p-4 text-sm font-bold text-zinc-600 dark:text-zinc-300">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {flatCategories.map(({ cat, level }) => (
              <tr
                key={cat.id}
                className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              >
                <td className="p-4 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  <span
                    style={{ paddingRight: `${level * 20}px` }}
                    className="inline-flex items-center gap-2"
                  >
                    {level > 0 && <span className="text-zinc-300">└</span>}
                    {cat.name}
                  </span>
                </td>
                <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400 ltr-dir" dir="ltr">
                  {cat.slug}
                </td>
                <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400">{cat.icon || "-"}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(cat.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCategoryTable;
