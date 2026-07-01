export interface GetCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  icon: string;
  specsSchema: string[] | null;
  subcategories: GetCategory[];
}
