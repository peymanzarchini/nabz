export interface GetLocation {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  districts?: GetLocation[];
}

export interface FormValues {
  title: string;
  description: string;
  condition: "new" | "used";
  isNegotiable: boolean;
  cityId: string;
  districtId: string;
  latitude?: number;
  longitude?: number;
  categoryId?: string;
}
