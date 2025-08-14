import { PUZZLE_PATHS } from './constants';

export const preloadSingleImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

export const preloadPuzzleImages = (): Promise<HTMLImageElement[]> => {
  const imagesToPreload = [
    PUZZLE_PATHS.PREVIEW,
    PUZZLE_PATHS.COMPLETE
  ];

  return Promise.all(
    imagesToPreload.map(src => preloadSingleImage(src))
  );
};