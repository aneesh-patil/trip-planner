export interface CollectionMetadata {
  authority:
    "government" | "foundation" | "historical_consensus" | "association";
  status: "active" | "review_needed" | "deprecated";
  lastVerified: string;
  verificationSource?: string;
  estimatedMembers?: number;
}

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
  metadata: CollectionMetadata;
}

export interface CollectionMembership {
  collectionId: string;
  sortOrder?: number;
  confirmed: boolean;
  source?: string;
}
