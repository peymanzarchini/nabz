import { Request, Response, NextFunction } from "express";
import { listingService } from "../services/listing.service.js";

class ListingController {
  async createListing(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];
      const result = await listingService.createListing(req.user!.id, req.body, files);

      res.success("آگهی شما با موفقیت ثبت شد و در انتظار تایید مدیر است.", result, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const listingController = new ListingController();
