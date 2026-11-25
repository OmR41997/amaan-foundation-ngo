import rawInitiatives from "@/public/collections/initiative-program.json";

export interface StaticInitiative {
  title: string;
  description: string;
  photoUrl: string;
  isPublished?: boolean;
}

export const staticInitiatives: StaticInitiative[] = (rawInitiatives as StaticInitiative[]).filter(
  (item) => item.isPublished !== false
);

export default staticInitiatives;
