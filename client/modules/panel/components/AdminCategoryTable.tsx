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
    <div className="bg-card rounded-sm shadow-sm border border-border overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <table className="w-full text-right">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="p-4 text-sm font-bold text-muted-foreground">نام دسته‌بندی</th>
              <th className="p-4 text-sm font-bold text-muted-foreground">اسلاگ</th>
              <th className="p-4 text-sm font-bold text-muted-foreground">آیکون</th>
              <th className="p-4 text-sm font-bold text-muted-foreground">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {flatCategories.map(({ cat, level }) => (
              <tr
                key={cat.id}
                className="border-b border-border hover:bg-muted/20 transition-colors"
              >
                <td className="p-4 text-sm font-medium text-foreground">
                  <span
                    style={{ paddingRight: `${level * 20}px` }}
                    className="inline-flex items-center gap-2"
                  >
                    {level > 0 && <span className="text-muted-foreground/50">└</span>}
                    {cat.name}
                  </span>
                </td>
                <td className="p-4 text-xs text-muted-foreground ltr-dir" dir="ltr">
                  {cat.slug}
                </td>
                <td className="p-4 text-xs text-muted-foreground">{cat.icon || "-"}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-sm transition-colors cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(cat.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-sm transition-colors cursor-pointer"
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
