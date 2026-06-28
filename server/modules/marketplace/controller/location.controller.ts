import { Request, Response, NextFunction } from "express";
import { locationService } from "../services/location.service.js";
import { CreateLocationInput } from "../validations/location.schema.js";

class LocationController {
  async createLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await locationService.createLocation(req.body as CreateLocationInput);
      res.success("شهر/محله با موفقیت ایجاد شد.", result, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllLocations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await locationService.getAllLocations();
      res.success("لیست شهرها و محلات.", result);
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
