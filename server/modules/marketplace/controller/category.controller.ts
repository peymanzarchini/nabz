import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service.js";
import { CreateCategoryInput, UpdateCategoryInput } from "../validations/category.schema.js";

class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await categoryService.createCategory(req.body as CreateCategoryInput);
      res.success("دسته‌بندی با موفقیت ایجاد شد.", result, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await categoryService.getAllCategories();
      res.success("لیست دسته‌بندی‌ها.", result);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await categoryService.updateCategory(id, req.body as UpdateCategoryInput);
      res.success("دسته‌بندی با موفقیت ویرایش شد.", result);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await categoryService.deleteCategory(id);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
