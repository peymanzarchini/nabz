import { HttpError } from "@/utils/httpError.js";
import { Location } from "../models/location.model.js";
import { CreateLocationInput } from "../validations/location.schema.js";

class LocationService {
  async createLocation(data: CreateLocationInput) {
    const existing = await Location.findOne({ where: { slug: data.slug } });
    if (existing) throw HttpError.conflict("این اسلاگ قبلاً ثبت شده است.");

    if (data.parentId) {
      const parent = await Location.findByPk(data.parentId);
      if (!parent) throw HttpError.notFound("شهر/استان والد یافت نشد.");
    }

    return await Location.create(data);
  }

  async getAllLocations() {
    return await Location.findAll({
      where: { parentId: null },
      include: [{ model: Location, as: "districts" }],
      order: [["createdAt", "ASC"]],
    });
  }
}

export const locationService = new LocationService();
