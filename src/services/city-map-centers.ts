// Provisional city viewport centers from the existing evidence CSV.
// These coordinates are for map display only.
// They must not be copied into business location fields or persisted as business coordinates.
// Geographic evidence remains subject to its existing review status.

export type CityMapCenter = [number, number];

const CITY_MAP_CENTERS: Record<number, CityMapCenter> = {
  235: [36.209585, 45.551826],
  253: [36.776632, 45.724071],
  255: [36.406365, 45.372521],
  259: [29.840951, 50.263431],
  360: [32.915235, 60.019846],
  410: [36.208851, 59.768974],
  491: [30.706428, 49.162584],
  493: [32.144294, 48.389938],
  571: [31.108734, 61.413684],
  577: [31.0427, 61.568119],
  582: [31.1458, 61.79049],
  584: [31.033459, 61.49547],
  588: [30.89393, 61.680724],
  592: [26.827266, 62.640532],
  593: [30.9401, 61.326671],
  600: [30.884838, 61.46183],
  794: [30.825851, 55.81185],
  832: [34.505637, 47.840567],
  853: [30.794688, 51.326254],
  864: [30.993375, 51.082115],
  996: [36.300865, 52.883828],
  1057: [27.207907, 53.04205],
  1073: [26.949641, 56.265339],
  1075: [26.59669, 54.93104],
  1122: [33.602023, 56.930905],
  1123: [34.365801, 56.931154],
};

export function getCityMapCenter(
  cityId: number | null | undefined
): CityMapCenter | null {
  if (cityId === null || cityId === undefined) {
    return null;
  }

  return CITY_MAP_CENTERS[cityId] ?? null;
}
