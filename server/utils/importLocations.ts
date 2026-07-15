import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "../config/database.js";
import { Location } from "../modules/marketplace/models/location.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "..", "..", "data");

const provincesPath = path.join(dataDir, "provinces.json");
const citiesPath = path.join(dataDir, "cities.json");

async function importLocations() {
  try {
    if (!fs.existsSync(provincesPath) || !fs.existsSync(citiesPath)) {
      console.error(`❌ Error: Could not find JSON files in ${dataDir}`);
      process.exit(1);
    }

    const provincesData = JSON.parse(fs.readFileSync(provincesPath, "utf-8"));
    const citiesData = JSON.parse(fs.readFileSync(citiesPath, "utf-8"));

    console.log("🚀 Connecting to database...");
    await sequelize.authenticate();

    console.log("🧹 Clearing existing locations...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await Location.truncate();
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("📍 Importing Provinces...");
    const provinceIdMap = new Map<string, string>();

    for (const prov of provincesData) {
      const newProvince = await Location.create({
        name: prov.name,
        slug: prov.slug,
        parentId: null,
        latitude: null,
        longitude: null,
      });
      provinceIdMap.set(String(prov.id), newProvince.id);
    }
    console.log(`✅ ${provincesData.length} provinces imported.`);

    console.log("🏙️ Importing Cities...");
    let cityCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const skippedExamples: string[] = [];

    for (const city of citiesData) {
      const parentId = provinceIdMap.get(String(city.province_id));

      if (parentId) {
        try {
          await Location.create({
            name: city.name,
            slug: city.slug + "-" + Math.random().toString(36).substring(2, 6),
            parentId: parentId,
            latitude: city.latitude || null,
            longitude: city.longitude || null,
          });
          cityCount++;
        } catch (err) {
          errorCount++;
          if (errorCount < 5) {
            console.error(`❌ Error importing city ${city.name}:`, (err as Error).message);
          }
        }
      } else {
        skippedCount++;
        if (skippedExamples.length < 5) {
          skippedExamples.push(`City: ${city.name}, province_id: ${city.province_id}`);
        }
      }
    }

    console.log(`✅ ${cityCount} cities imported successfully.`);
    if (skippedCount > 0) {
      console.warn(`⚠️ ${skippedCount} cities skipped due to missing province_id.`);
      console.warn("Examples of skipped cities:", skippedExamples);
      console.warn("Available province IDs in map:", Array.from(provinceIdMap.keys()).slice(0, 5));
    }
    if (errorCount > 0) {
      console.warn(`⚠️ ${errorCount} cities failed to import.`);
    }

    console.log("🎉 Import finished successfully!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during import:", error);
    process.exit(1);
  }
}

importLocations();
