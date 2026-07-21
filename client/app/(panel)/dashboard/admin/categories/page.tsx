"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { GetCategory } from "@/modules/home/types";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import CategoryFormModal from "@/modules/panel/components/modals/CategoryFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminCategoryTable from "@/modules/panel/components/AdminCategoryTable";

const AdminCategoriesPage = () => {
  const { data: categories, isLoading } = useCategories();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GetCategory | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: GetCategory) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await api.delete(`/marketplace/categories/${deleteTargetId}`);
      toast.success("دسته‌بندی حذف شد.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setDeleteTargetId(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
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

  const parentOptions = flatCategories.map(({ cat, level }) => ({
    id: cat.id,
    name: `${"— ".repeat(level)}${cat.name}`,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-zinc-800 dark:text-white">مدیریت دسته‌بندی‌ها</h1>
        <Button
          onClick={openCreateModal}
          className="bg-linear-to-r from-violet-600 to-teal-500 text-white py-4 rounded-sm cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 ml-2" />
          افزودن دسته جدید
        </Button>
      </div>

      <AdminCategoryTable
        flatCategories={flatCategories}
        isLoading={isLoading}
        openEditModal={openEditModal}
        setDeleteTargetId={setDeleteTargetId}
      />

      {isModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          parentCategories={parentOptions}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ["categories"] })}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="حذف دسته‌بندی"
        message="آیا از حذف این دسته‌بندی مطمئن هستید؟ توجه کنید که اگر این دسته دارای زیردسته باشد، عملیات حذف ناموفق خواهد بود."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminCategoriesPage;
