"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetCategory } from "@/modules/home/types";
import CategoryFormModal from "@/modules/panel/components/modals/CategoryFormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminCategoryTable from "@/modules/panel/components/AdminCategoryTable";
import {
  useAdminCategories,
  useDeleteCategory,
} from "@/modules/panel/hooks/useAdmin";
import CategoryStatusTabs from "@/modules/panel/components/listings/CategoryStatusTabs";

const AdminCategoriesPage = () => {
  const { data: categories, isLoading } = useAdminCategories();
  const queryClient = useQueryClient();

  const deleteMutation = useDeleteCategory();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<GetCategory | null>(
    null,
  );

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting] = useState<boolean>(false);

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
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => {
        setDeleteTargetId(null);
      },
    });
  };

  const flatCategories: { cat: GetCategory; level: number }[] = [];
  const flatten = (cats: GetCategory[] | undefined, level = 0) => {
    if (!cats) return;
    for (const cat of cats) {
      if (filterStatus === "all" || cat.status === filterStatus) {
        flatCategories.push({ cat, level });
      }
      if (cat.subcategories && cat.subcategories.length > 0) {
        flatten(cat.subcategories, level + 1);
      }
    }
  };
  flatten(categories);

  const parentOptions = flatCategories
    .filter(({ cat }) => cat.status !== "archived")
    .map(({ cat, level }) => ({
      id: cat.id,
      name: `${"— ".repeat(level)}${cat.name}`,
    }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-foreground">
          مدیریت دسته‌بندی‌ها
        </h1>
        <Button
          onClick={openCreateModal}
          size="lg"
          className="rounded-sm cursor-pointer"
        >
          <PlusCircle className="h-4 w-4 ml-2" />
          افزودن دسته جدید
        </Button>
      </div>

      <CategoryStatusTabs
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

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
          onSuccess={() =>
            queryClient.invalidateQueries({ queryKey: ["categories"] })
          }
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
