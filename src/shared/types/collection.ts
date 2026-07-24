export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  type: "official" | "historical" | "curated";
  icon: string;
  badgeColor: string;
  sortOrder: number;
  officialSource?: string;
  sourceUrl?: string;
}

export interface CollectionMembership {
  collectionId: string;
  confirmed: boolean;
  source?: string;
}
