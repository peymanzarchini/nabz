import { logger } from "@/config/logger.js";
import { Auth } from "@/modules/auth/model/auth.model.js";
import { Category } from "@/modules/marketplace/models/category.model.js";
import { Location } from "@/modules/marketplace/models/location.model.js";
import { v4 as uuidv4 } from "uuid";
import { generateSlug } from "./slugify.js";
import { Listing } from "@/modules/marketplace/models/listing.model.js";
import { ListingVariant } from "@/modules/marketplace/models/variant.model.js";
import { ListingCondition, ListingStatus } from "@/modules/marketplace/types/index.js";
import { UserRole, UserStatus } from "@/types/index.js";

export const userIdMap = new Map<number, string>();
export const categoryIdMap = new Map<number, string>();
export const locationIdMap = new Map<number, string>();
export const listingIdMap = new Map<number, string>();

const oldUsers = [
  {
    id: 1,
    firstName: "پیمان",
    lastName: "زرچینی",
    email: "peymanzarchini@gmail.com",
    password: "$2b$12$e4qtKEjzKx2sYAlpIgewjO8Eg6l9QEF3h0Wv1ro2PD5vueF9WxnwK",
    phoneNumber: "09026960606",
    avatar: null,
    role: "admin",
    status: "active",
    isVerified: true,
  },
  {
    id: 2,
    firstName: "پوریا",
    lastName: "زرچینی",
    email: "puryazarchini@gmail.com",
    password: "$2b$12$RsSZHJ5IFseNW8bG3pQ/ruVSaCX5t88YNR9s828xNjYx9bu5RFroy",
    phoneNumber: "09021910101",
    avatar: null,
    role: "support",
    status: "active",
    isVerified: true,
  },
  {
    id: 3,
    firstName: "امیر",
    lastName: "زرچینی",
    email: "amirzarchini@gmail.com",
    password: "$2b$12$T0E8YzOC.xuyniGCQy/MBOI7hlGIan/5YDwAD/ruIEDW2cMJ/LnHm",
    phoneNumber: "09025026950",
    avatar: null,
    role: "seller",
    status: "active",
    isVerified: true,
  },
  {
    id: 4,
    firstName: "علی",
    lastName: "زرچینی",
    email: "alizarchini@gmail.com",
    password: "$2b$12$VnbqkvZlpo6SegvKeBKi0eD9SX5Fk1f0D0fm5ImCvvCYpK6PTKDBO",
    phoneNumber: "09022920202",
    avatar: null,
    role: "driver",
    status: "active",
    isVerified: true,
  },
  {
    id: 5,
    firstName: "رضا",
    lastName: "زرچینی",
    email: "rezazarchini@gmail.com",
    password: "$2b$12$tBIwDUCi3n1nXnA3yPWa3eATpEeaSEOAYrGzgKEyW6ULKzwtzKliC",
    phoneNumber: "09023930303",
    avatar: null,
    role: "customer",
    status: "active",
    isVerified: true,
  },
];

const oldCategories = [
  {
    id: 1,
    name: "وسایل نقلیه",
    slug: "vehicles",
    parentId: null,
    icon: "car",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 2,
    name: "املاک",
    slug: "real-estate",
    parentId: null,
    icon: "building",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 3,
    name: "موبایل و تبلت",
    slug: "mobile-tablet",
    parentId: null,
    icon: "mobile",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 4,
    name: "کالای دیجیتال",
    slug: "digital-goods",
    parentId: null,
    icon: "digital",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 5,
    name: "خانه و آشپزخانه",
    slug: "home-kitchen",
    parentId: null,
    icon: "home-kitchen",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 6,
    name: "لوازم خانگی",
    slug: "home-appliances",
    parentId: null,
    icon: "home-appliances",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 7,
    name: "مد و پوشاک",
    slug: "fashion-clothing",
    parentId: null,
    icon: "fashion",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 8,
    name: "زیبایی و سلامت",
    slug: "beauty-health",
    parentId: null,
    icon: "beauty-health",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 9,
    name: "ورزش و سفر",
    slug: "sport-travel",
    parentId: null,
    icon: "sport",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 10,
    name: "خودرو",
    slug: "cars",
    parentId: 1,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 11,
    name: "سواری",
    slug: "sedan",
    parentId: 10,
    icon: null,
    specsSchema:
      '{"fuel":{"type":"dropdown","label":"نوع سوخت","options":["بنزین","گازوئیل","دوگانه سوز","برقی","هیبرید"],"required":true,"isVariant":false},"year":{"type":"number","label":"سال تولید","required":true,"isVariant":false},"brand":{"type":"string","label":"برند","required":true,"isVariant":false},"color":{"type":"dropdown","label":"رنگ","options":["سفید","مشکی","نقره‌ای","خاکستری","آبی","قرمز","زرد","سبز"],"required":true,"isVariant":false},"model":{"type":"string","label":"مدل","required":true,"isVariant":false},"gearbox":{"type":"dropdown","label":"گیربکس","options":["دستی","اتوماتیک","CVT","تیپ ترونیک"],"required":true,"isVariant":false},"mileage":{"type":"number","label":"کارکرد (کیلومتر)","required":true,"isVariant":false}}',
    hasSpecs: false,
  },
  {
    id: 12,
    name: "شاسی بلند",
    slug: "suv",
    parentId: 10,
    icon: null,
    specsSchema: '{"inheritFrom": 11}',
    hasSpecs: false,
  },
  {
    id: 13,
    name: "وانت",
    slug: "pickup",
    parentId: 10,
    icon: null,
    specsSchema: '{"inheritFrom": 11}',
    hasSpecs: false,
  },
  {
    id: 14,
    name: "کامیون",
    slug: "truck",
    parentId: 10,
    icon: null,
    specsSchema:
      '{"fuel":{"type":"dropdown","label":"سوخت","options":["گازوئیل","بنزین"],"required":false,"isVariant":false},"year":{"type":"number","label":"سال تولید","required":true,"isVariant":false},"brand":{"type":"string","label":"برند","required":true,"isVariant":false},"model":{"type":"string","label":"مدل","required":true,"isVariant":false},"mileage":{"type":"number","label":"کارکرد","required":false,"isVariant":false},"capacity":{"type":"number","label":"ظرفیت بار (تن)","required":false,"isVariant":false}}',
    hasSpecs: false,
  },
  {
    id: 15,
    name: "کامیونت",
    slug: "light-truck",
    parentId: 10,
    icon: null,
    specsSchema: '{"inheritFrom": 14}',
    hasSpecs: false,
  },
  {
    id: 16,
    name: "اتوبوس",
    slug: "bus",
    parentId: 10,
    icon: null,
    specsSchema: '{"inheritFrom": 14}',
    hasSpecs: false,
  },
  {
    id: 17,
    name: "موتورسیکلت",
    slug: "motorcycles",
    parentId: 1,
    icon: "motorcycle",
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 18,
    name: "شهری",
    slug: "street-bike",
    parentId: 17,
    icon: null,
    specsSchema:
      '{"year":{"type":"number","label":"سال تولید","required":false,"isVariant":false},"brand":{"type":"string","label":"برند","required":false,"isVariant":false},"color":{"type":"string","label":"رنگ","required":false,"isVariant":false},"model":{"type":"string","label":"مدل","required":false,"isVariant":false},"engine":{"type":"number","label":"حجم موتور (CC)","required":false,"isVariant":false},"mileage":{"type":"number","label":"کارکرد","required":false,"isVariant":false}}',
    hasSpecs: false,
  },
  {
    id: 19,
    name: "اسکوتر",
    slug: "scooter",
    parentId: 17,
    icon: null,
    specsSchema: '{"inheritFrom": 18}',
    hasSpecs: false,
  },
  {
    id: 20,
    name: "کراس",
    slug: "cross",
    parentId: 17,
    icon: null,
    specsSchema: '{"inheritFrom": 18}',
    hasSpecs: false,
  },
  {
    id: 21,
    name: "فروش مسکونی",
    slug: "buy-residential",
    parentId: 2,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 22,
    name: "اجاره مسکونی",
    slug: "rent-residential",
    parentId: 2,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 23,
    name: "فروش اداری و تجاری",
    slug: "buy-commercial-property",
    parentId: 2,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 24,
    name: "اجاره اداری و تجاری",
    slug: "rent-commercial-property",
    parentId: 2,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 25,
    name: "آپارتمان",
    slug: "buy-apartment",
    parentId: 21,
    icon: null,
    specsSchema:
      '{"area":{"type":"number","label":"متراژ (متر مربع)","required":true,"isVariant":false},"rent":{"type":"number","label":"مبلغ اجاره ماهانه (تومان)","required":true,"isVariant":false},"floor":{"type":"string","label":"طبقه","required":false,"isVariant":false},"rooms":{"type":"dropdown","label":"تعداد اتاق خواب","options":["یک","دو","سه","چهار","پنج یا بیشتر"],"required":true,"isVariant":false},"deposit":{"type":"number","label":"مبلغ رهن (تومان)","required":true,"isVariant":false},"parking":{"type":"boolean","label":"پارکینگ","required":false,"isVariant":false},"elevator":{"type":"boolean","label":"آسانسور","required":false,"isVariant":false},"year_built":{"type":"string","label":"سال ساخت","required":true,"isVariant":false},"total_floors":{"type":"number","label":"تعداد کل طبقات","required":false,"isVariant":false}}',
    hasSpecs: false,
  },
  {
    id: 26,
    name: "ویلا",
    slug: "buy-villa",
    parentId: 21,
    icon: null,
    specsSchema: '{"inheritFrom": 25}',
    hasSpecs: false,
  },
  {
    id: 27,
    name: "گوشی های اپل",
    slug: "apple-phones",
    parentId: 3,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 28,
    name: "برندهای مختلف گوشی موبایل",
    slug: "mobile-brands",
    parentId: 3,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
  {
    id: 29,
    name: "آیفون 17",
    slug: "iphone-17",
    parentId: 27,
    icon: null,
    specsSchema:
      '{"ram":{"type":"dropdown","label":"حافظه رم","options":["8 گیگابایت","12 گیگابایت","16 گیگابایت"],"required":false,"isVariant":false},"brand":{"type":"string","label":"برند","required":true,"isVariant":false},"color":{"type":"dropdown","label":"رنگ","options":["مشکی","سفید","آبی","سبز","طلایی"],"required":true,"isVariant":true},"storage":{"type":"dropdown","label":"حافظه داخلی","options":["128 گیگابایت","256 گیگابایت","512 گیگابایت","1 ترابایت"],"required":true,"isVariant":true},"battery_health":{"type":"number","label":"سلامت باتری (درصد)","required":true,"isVariant":false}}',
    hasSpecs: true,
  },
  {
    id: 30,
    name: "گوشی سامسونگ",
    slug: "samsung-phones",
    parentId: 28,
    icon: null,
    specsSchema: "null",
    hasSpecs: false,
  },
];

const oldLocations = [
  { id: 1, name: "تهران", slug: "tehran", parentId: null, latitude: 35.6892, longitude: 51.389 },
  { id: 2, name: "چهارباغ", slug: "chaharbagh", parentId: 1 },
];

const oldListings = [
  {
    id: 4,
    title: "فروش آیفون ۱۷ پرو مکس",
    description: "سالم بدون خط و خش",
    isNegotiable: false,
    condition: "new",
    status: "active",
    cityId: 1,
    districtId: 2,
    latitude: 35.7449,
    longitude: 51.3041,
    thumbnail: "/uploads/img-1783346813215-532176572.webp",
    images:
      '["/uploads/img-1783346813215-532176572.webp", "/uploads/img-1783346813215-613266903.webp"]',
    specs: '{"ram": "12 گیگابایت", "brand": "Apple", "battery_health": 100}',
    minPrice: 90000000,
    averageRating: 0,
    reviewCount: 0,
    aiReviewSummary: null,
    isAmazingOffer: false,
    rejectionReason: null,
    categoryId: 29,
    userId: 1,
  },
];

const oldVariants = [
  {
    id: 3,
    listingId: 4,
    specs: '{"color": "نارنجی", "storage": "256 گیگابایت"}',
    price: 90000000,
    discountPercentage: 0,
    discountExpiry: null,
    stock: 2,
    sku: null,
  },
  {
    id: 4,
    listingId: 4,
    specs: '{"color": "مشکی", "storage": "512 گیگابایت"}',
    price: 105000000,
    discountPercentage: 0,
    discountExpiry: null,
    stock: 1,
    sku: null,
  },
];

async function seedUsers() {
  logger.info("🌱 شروع سید کردن کاربران...");
  for (const oldUser of oldUsers) {
    const newId = uuidv4();
    userIdMap.set(oldUser.id, newId);
    await Auth.create(
      {
        id: newId,
        firstName: oldUser.firstName,
        lastName: oldUser.lastName,
        email: oldUser.email,
        password: oldUser.password,
        phoneNumber: oldUser.phoneNumber,
        avatar: oldUser.avatar!,
        role: oldUser.role as UserRole,
        status: oldUser.status as UserStatus,
        isVerified: oldUser.isVerified,
      },
      { hooks: false },
    );
  }
  logger.info("✅ سید کاربران انجام شد.");
}

async function seedCategories() {
  logger.info("🌱 شروع سید کردن دسته‌بندی‌ها...");
  for (const oldCat of oldCategories) {
    const newId = uuidv4();
    categoryIdMap.set(oldCat.id, newId);
    const newParentId = oldCat.parentId ? categoryIdMap.get(oldCat.parentId) : null;
    let parsedSpecs = null;
    if (oldCat.specsSchema && oldCat.specsSchema !== "null") {
      parsedSpecs = JSON.parse(oldCat.specsSchema);
      if (parsedSpecs.inheritFrom) {
        parsedSpecs.inheritFrom = categoryIdMap.get(parsedSpecs.inheritFrom);
      }
    }
    await Category.create({
      id: newId,
      name: oldCat.name,
      slug: oldCat.slug,
      parentId: newParentId,
      icon: oldCat.icon,
      specsSchema: parsedSpecs,
      hasSpecs: oldCat.hasSpecs,
    });
  }
  logger.info("✅ سید دسته‌بندی‌ها انجام شد.");
}

async function seedLocations() {
  logger.info("🌱 شروع سید کردن مکان‌ها...");
  for (const oldLoc of oldLocations) {
    const newId = uuidv4();
    locationIdMap.set(oldLoc.id, newId);
    const newParentId = oldLoc.parentId ? locationIdMap.get(oldLoc.parentId) : null;
    await Location.create({
      id: newId,
      name: oldLoc.name,
      slug: oldLoc.slug,
      parentId: newParentId,
    });
  }
  logger.info("✅ سید مکان‌ها انجام شد.");
}

async function seedListings() {
  logger.info("🌱 شروع سید کردن آگهی‌ها...");
  for (const oldList of oldListings) {
    const newId = uuidv4();
    listingIdMap.set(oldList.id, newId);

    // ساخت اسلاگ دیجی‌کالایی
    const slug = generateSlug(oldList.title);

    await Listing.create({
      id: newId,
      title: oldList.title,
      slug,
      description: oldList.description,
      isNegotiable: oldList.isNegotiable,
      condition: oldList.condition as ListingCondition,
      status: oldList.status as ListingStatus,
      cityId: locationIdMap.get(oldList.cityId)!,
      districtId: oldList.districtId ? locationIdMap.get(oldList.districtId) : null,
      latitude: oldList.latitude,
      longitude: oldList.longitude,
      thumbnail: oldList.thumbnail,
      images: JSON.parse(oldList.images),
      specs: JSON.parse(oldList.specs),
      minPrice: oldList.minPrice,
      averageRating: oldList.averageRating,
      reviewCount: oldList.reviewCount,
      aiReviewSummary: oldList.aiReviewSummary,
      isAmazingOffer: oldList.isAmazingOffer,
      rejectionReason: oldList.rejectionReason,
      categoryId: categoryIdMap.get(oldList.categoryId)!,
      userId: userIdMap.get(oldList.userId)!,
    });
  }
  logger.info("✅ سید آگهی‌ها انجام شد.");
}

async function seedVariants() {
  logger.info("🌱 شروع سید کردن واریانت‌ها...");
  for (const oldVar of oldVariants) {
    const newId = uuidv4();
    await ListingVariant.create({
      id: newId,
      listingId: listingIdMap.get(oldVar.listingId)!,
      specs: JSON.parse(oldVar.specs),
      price: oldVar.price,
      discountPercentage: oldVar.discountPercentage,
      discountExpiry: oldVar.discountExpiry,
      stock: oldVar.stock,
      sku: oldVar.sku,
    });
  }
  logger.info("✅ سید واریانت‌ها انجام شد.");
}

export async function runSeedIfEmpty() {
  try {
    const userCount = await Auth.count();
    if (userCount === 0) {
      logger.info("🚀 دیتابیس خالی است، در حال اجرای Seed...");

      await seedUsers();
      await seedCategories();
      await seedLocations();
      await seedListings();
      await seedVariants();

      logger.info("🎉 عملیات Seed با موفقیت پایان یافت.");
    } else {
      logger.info("ℹ️ دیتابیس دارای دیتا است، از اجرای Seed صرف‌نظر شد.");
    }
  } catch (error) {
    logger.error("❌ خطا در اجرای اسکریپت سید:", error);
  }
}
