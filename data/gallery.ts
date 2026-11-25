import rawGallery from "@/public/collections/gallery.json";

export interface StaticGalleryItem {
  eventName?: string;
  eventType?: string;
  photoUrl: string;
  source?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type StaticGalleryCollection = Record<string, StaticGalleryItem[]>;

export const staticGallery: StaticGalleryCollection = rawGallery as unknown as StaticGalleryCollection;

export interface GalleryCategoryOption {
  id: string;
  title: string;
}

/**
 * Returns distinct category list excluding "nostalgia"
 */
export function getStaticGalleryCategories(locale: string = "en"): GalleryCategoryOption[] {
  const typeSet = new Set<string>();

  Object.values(staticGallery).forEach((group) => {
    if (Array.isArray(group)) {
      group.forEach((item) => {
        const type = item.eventType?.trim();
        if (type && type.toLowerCase() !== "nostalgia") {
          typeSet.add(type);
        }
      });
    }
  });

  return [
    { id: "all", title: locale === "hi" ? "सभी श्रेणियां" : "All categories" },
    ...Array.from(typeSet).map((cat) => ({
      id: cat,
      title: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];
}

/**
 * Returns public gallery images (excluding nostalgia), optionally filtered by category
 */
export function getStaticGalleryImages(category: string = "all"): Array<{
  src: string;
  eventName: string;
  eventType: string;
}> {
  const allItems: Array<{ src: string; eventName: string; eventType: string }> = [];

  Object.values(staticGallery).forEach((group) => {
    if (Array.isArray(group)) {
      group.forEach((it) => {
        if (it.photoUrl && it.eventType?.toLowerCase() !== "nostalgia") {
          if (it.isPublished === undefined || it.isPublished === true) {
            if (category === "all" || it.eventType?.toLowerCase() === category.toLowerCase()) {
              allItems.push({
                src: it.photoUrl,
                eventName: it.eventName || "Gallery Image",
                eventType: it.eventType || "General",
              });
            }
          }
        }
      });
    }
  });

  return allItems;
}

/**
 * Returns nostalgia items dedicated to Amaan's Story
 */
export function getStaticNostalgiaItems(): StaticGalleryItem[] {
  const list = staticGallery.amaan || [];
  return list.filter(
    (item) => item.eventType?.toLowerCase() === "nostalgia" && Boolean(item.photoUrl)
  );
}

export default staticGallery;
