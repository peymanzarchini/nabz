import { Request, Response, NextFunction } from "express";
import { listingService } from "../services/listing.service.js";
import {
  CreateListingInput,
  GetListingQuery,
  UpdateListingInput,
  UpdateListingStatusInput,
} from "../validations/listing.schema.js";

class ListingController {
  async createListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const result = await listingService.createListing(
        req.user!.id,
        req.body as CreateListingInput,
        files,
      );
      res.success("آگهی شما با موفقیت ثبت شد و در انتظار تایید مدیر است.", result, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllListings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as GetListingQuery;
      const result = await listingService.getAllListings(query);

      res.success("لیست آگهی‌ها.", result.items, 200, {
        pageSize: result.pagination.pageSize,
        pageNumber: result.pagination.currentPage,
        totalItems: result.pagination.totalItems,
        totalPages: result.pagination.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await listingService.getListingById(id, req.user?.id, req.user?.role);
      res.success("جزئیات آگهی.", result);
    } catch (error) {
      next(error);
    }
  }

  async updateListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await listingService.updateListing(
        id,
        req.user!.id,
        req.user!.role,
        req.body as UpdateListingInput,
      );
      res.success("آگهی با موفقیت ویرایش شد.", result);
    } catch (error) {
      next(error);
    }
  }

  async deleteListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await listingService.deleteListing(id, req.user!.id, req.user!.role);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async updateListingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await listingService.updateListingStatus(
        id,
        req.body as UpdateListingStatusInput,
      );
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async toggleAmazingOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { isAmazingOffer } = req.body as { isAmazingOffer: boolean };
      const result = await listingService.toggleAmazingOffer(id, isAmazingOffer);
      res.success(result.message, null);
    } catch (error) {
      next(error);
    }
  }

  async deleteListingImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { imageUrl } = req.body as { imageUrl: string };
      const result = await listingService.deleteListingImage(
        id,
        req.user!.id,
        req.user!.role,
        imageUrl,
      );
      res.success(result.message, { newThumbnail: result.newThumbnail });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await listingService.getDashboardStats(req.user!.id, req.user!.role);
      res.success("آمار دریافتی", stats);
    } catch (error) {
      next(error);
    }
  }
}

export const listingController = new ListingController();
