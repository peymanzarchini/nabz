"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { GetCategory } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import CategoryFormModal from "@/modules/panel/components/CategoryFormModal";

const AdminCategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GetCategory | null>(null);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: GetCategory) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این دسته‌بندی مطمئن هستید؟")) return;
    try {
      await api.delete(`/marketplace/categories/${id}`);
      toast.success("دسته‌بندی حذف شد.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const flatCategories: { cat: GetCategory; level: number }[] = [];
  const flatten = (cats: GetCategory[] | undefined, level = 0) => {
    if (!cats) return;
    for (const cat of cats) {
      flatCategories.push({ cat, level });
      if (cat.subcategories && cat.subcategories.length > 0) {
        flatten(cat.subcategories, level + 1);
      }
    }
  };
  flatten(categories);

  const parentOptions = categories || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-zinc-800 dark:text-white">مدیریت دسته‌بندی‌ها</h1>
        <Button
          onClick={openCreateModal}
          className="bg-linear-to-r from-violet-600 to-teal-500 text-white"
        >
          <PlusCircle className="h-4 w-4 ml-2" />
          افزودن دسته جدید
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
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
                  <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400">
                    {cat.icon || "-"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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

      {isModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          parentCategories={parentOptions}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["categories"] })}
        />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
