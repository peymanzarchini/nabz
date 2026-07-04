"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination as PaginationType } from "../types";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  if (pagination.totalPages <= 1) return null;
  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        disabled={!pagination.hasPrevPage}
        onClick={() => onPageChange(pagination.currentPage - 1)}
        className="rounded-lg bg-white dark:bg-zinc-900"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === pagination.currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
          className="rounded-lg w-10 h-10 p-0 bg-white dark:bg-zinc-900"
        >
          {page.toLocaleString("fa-IR")}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.currentPage + 1)}
        className="rounded-lg bg-white dark:bg-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
