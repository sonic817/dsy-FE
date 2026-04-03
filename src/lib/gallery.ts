export interface GalleryModalItem {
  src: string;
  alt: string;
}

export interface GalleryModalState extends GalleryModalItem {
  list?: GalleryModalItem[];
  index?: number;
}

export function getGalleryLabel(title: string | null | undefined, fallback: string): string {
  const trimmed = title?.trim();
  return trimmed || fallback;
}

export function buildGalleryModalState(list: GalleryModalItem[], index: number): GalleryModalState | null {
  if (list.length === 0 || index < 0 || index >= list.length) {
    return null;
  }

  return {
    ...list[index],
    list,
    index,
  };
}

export function getAdjacentGalleryModalState(
  modalImage: GalleryModalState | null,
  offset: number
): GalleryModalState | null {
  if (!modalImage?.list || modalImage.index === undefined) {
    return null;
  }

  return buildGalleryModalState(modalImage.list, modalImage.index + offset);
}
