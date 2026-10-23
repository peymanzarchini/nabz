import { GetCategory } from "@/modules/home/types";
import { Loader2, Pencil, Trash2, Check, Archive, EyeOff } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useUpdateCategoryStatus } from "@/modules/panel/hooks/useAdmin";
import { getCategoryStatusInfo } from "../utils";

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
  const statusMutation = useUpdateCategoryStatus();

  const handleQuickStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  return (
    <div className="bg-card rounded-sm shadow-sm border border-border overflow-hidden">
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : flatCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-bold text-foreground mb-2">
            دسته‌بندی‌ای در این وضعیت وجود ندارد
          </p>
          <p className="text-sm text-muted-foreground">
            دسته‌بندی‌های دیگر را امتحان کنید.
          </p>
        </div>
      ) : (
        <table className="w-full text-right">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="p-4 text-sm font-bold text-muted-foreground">
                نام دسته‌بندی
              </th>
              <th className="p-4 text-sm font-bold text-muted-foreground hidden md:table-cell">
                اسلاگ
              </th>
              <th className="p-4 text-sm font-bold text-muted-foreground hidden md:table-cell">
                آیکون
              </th>
              <th className="p-4 text-sm font-bold text-muted-foreground">
                وضعیت
              </th>
              <th className="p-4 text-sm font-bold text-muted-foreground text-left">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {flatCategories.map(({ cat, level }) => {
              const statusInfo = getCategoryStatusInfo(cat.status);
              return (
                <tr
                  key={cat.id}
                  className="border-b border-border hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4 text-sm font-medium text-foreground">
                    <span
                      style={{ paddingRight: `${level * 20}px` }}
                      className="inline-flex items-center gap-2"
                    >
                      {level > 0 && (
                        <span className="text-muted-foreground/50">└</span>
                      )}
                      {cat.name}
                    </span>
                  </td>
                  <td
                    className="p-4 text-xs text-muted-foreground ltr-dir hidden md:table-cell"
                    dir="ltr"
                  >
                    {cat.slug}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground hidden md:table-cell">
                    {cat.icon || "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-sm ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* ✅ دکمه‌های سریع تغییر وضعیت */}
                      {cat.status !== "active" && (
                        <button
                          onClick={() =>
                            handleQuickStatusChange(cat.id, "active")
                          }
                          disabled={statusMutation.isPending}
                          className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                          title="فعال کردن"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {cat.status !== "draft" && (
                        <button
                          onClick={() =>
                            handleQuickStatusChange(cat.id, "draft")
                          }
                          disabled={statusMutation.isPending}
                          className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                          title="پیش‌نویس"
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                      )}
                      {cat.status !== "archived" && (
                        <button
                          onClick={() =>
                            handleQuickStatusChange(cat.id, "archived")
                          }
                          disabled={statusMutation.isPending}
                          className="p-2 text-muted-foreground hover:bg-muted rounded-sm transition-colors cursor-pointer disabled:opacity-50"
                          title="بایگانی"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                      )}

                      <div className="w-px h-6 bg-border mx-1" />

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
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCategoryTable;
