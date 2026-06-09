// All coordinates are real-world verified lat/lng.
// Each outline is normalized to a square scene-space window centered at origin
// so the India → US morph happens "in place" visually.

export type Treatment = "origin" | "stop" | "home" | "college" | "current";

export type JourneyStop = {
  id: string;
  label: string;
  sublabel: string;
  year: string;
  lat: number;
  lng: number;
  color: string;
  dotSize: number;
  pulseSpeed: number;
  treatment: Treatment;
  region: "india" | "us";
};

export const JOURNEY_STOPS: readonly JourneyStop[] = [
  {
    id: "hyderabad",
    label: "Hyderabad, Telangana",
    sublabel: "2006–2008",
    year: "2006–2008",
    lat: 17.384,
    lng: 78.456,
    color: "#fb923c",
    dotSize: 0.016,
    pulseSpeed: 1.0,
    treatment: "stop",
    region: "india",
  },
  {
    id: "overlandPark",
    label: "Overland Park, Kansas",
    sublabel: "2008–2009",
    year: "2008–2009",
    lat: 38.982,
    lng: -94.671,
    color: "#a78bfa",
    dotSize: 0.015,
    pulseSpeed: 1.0,
    treatment: "stop",
    region: "us",
  },
  {
    id: "stLouis",
    label: "St. Louis, Missouri",
    sublabel: "2009–2023",
    year: "2009–2023",
    lat: 38.627,
    lng: -90.199,
    color: "#818cf8",
    dotSize: 0.024,
    pulseSpeed: 0.9,
    treatment: "home",
    region: "us",
  },
  {
    id: "miami",
    label: "University of Miami",
    sublabel: "2023–2026",
    year: "2023–2026",
    lat: 25.721,
    lng: -80.268,
    color: "#f59e0b",
    dotSize: 0.028,
    pulseSpeed: 1.2,
    treatment: "college",
    region: "us",
  },
  {
    id: "dallas",
    label: "Dallas, Texas",
    sublabel: "2025–Present",
    year: "2025–Present",
    lat: 33.158,
    lng: -96.824,
    color: "#6366f1",
    dotSize: 0.02,
    pulseSpeed: 1.4,
    treatment: "current",
    region: "us",
  },
];

// Bounding boxes used to normalize geo coords to a centered [-1, 1] window
export const INDIA_BBOX = {
  minLat: 6.5,
  maxLat: 36,
  minLng: 67,
  maxLng: 98,
};

export const US_BBOX = {
  minLat: 24,
  maxLat: 50,
  minLng: -126,
  maxLng: -66,
};

const PADDING = 0.08; // 8% padding inside the scene window

export type BBox = { minLat: number; maxLat: number; minLng: number; maxLng: number };

/** Map a lat/lng into normalized [-1, 1] x [-1, 1] scene coords using the bbox. */
export function geoToScene(
  lat: number,
  lng: number,
  bbox: BBox
): [number, number, number] {
  const wLng = bbox.maxLng - bbox.minLng;
  const wLat = bbox.maxLat - bbox.minLat;
  const w = Math.max(wLng, wLat);
  const cx = (bbox.minLng + bbox.maxLng) / 2;
  const cy = (bbox.minLat + bbox.maxLat) / 2;
  const scale = (2 - 2 * PADDING) / w;
  const x = (lng - cx) * scale;
  const y = (lat - cy) * scale;
  return [x, y, 0];
}

/** Interpolate a closed polygon to produce N evenly-spaced boundary points. */
function densifyClosed(verts: [number, number][], total: number): [number, number][] {
  const n = verts.length;
  // perimeter
  const lens: number[] = [];
  let perim = 0;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = verts[i];
    const [bx, by] = verts[(i + 1) % n];
    const d = Math.hypot(bx - ax, by - ay);
    lens.push(d);
    perim += d;
  }
  const out: [number, number][] = [];
  for (let i = 0; i < total; i++) {
    let dist = (i / total) * perim;
    for (let j = 0; j < n; j++) {
      if (dist <= lens[j]) {
        const t = lens[j] === 0 ? 0 : dist / lens[j];
        const [ax, ay] = verts[j];
        const [bx, by] = verts[(j + 1) % n];
        out.push([ax + (bx - ax) * t, ay + (by - ay) * t]);
        break;
      }
      dist -= lens[j];
    }
  }
  return out;
}

// India simplified boundary (lng, lat) — clockwise from northwest
const INDIA_VERTS: [number, number][] = [
  [74.0, 34.5], // J&K NW
  [78.5, 34.5], // Ladakh
  [80.0, 30.5],
  [82.0, 28.5],
  [85.0, 27.5], // Nepal border
  [88.0, 27.5],
  [89.5, 27.0], // Sikkim/Bhutan
  [92.0, 27.5], // Arunachal W
  [95.5, 28.5], // Arunachal NE
  [97.0, 27.5],
  [95.0, 25.0], // Nagaland
  [94.0, 23.5], // Manipur
  [93.0, 22.0], // Mizoram
  [91.5, 22.5], // Bangladesh E
  [88.5, 22.5], // West Bengal
  [86.5, 20.5], // Odisha
  [85.0, 19.0],
  [83.0, 17.5],
  [81.0, 16.0],
  [80.0, 13.0], // Tamil Nadu E coast
  [78.5, 9.5],
  [77.5, 8.1], // Kanyakumari
  [76.5, 9.5],
  [75.5, 12.0], // Karnataka coast
  [73.7, 15.5], // Goa
  [72.8, 19.0], // Mumbai
  [72.5, 21.0],
  [70.0, 21.0], // Gujarat S
  [68.5, 22.5], // Gujarat W
  [68.0, 24.0], // Kutch
  [70.5, 27.0], // Rajasthan W
  [73.0, 30.0], // Punjab
  [74.0, 32.5],
];

// US contiguous simplified boundary (lng, lat) — clockwise from NW
const US_VERTS: [number, number][] = [
  [-124.5, 48.5], // Washington NW
  [-119.0, 49.0], // Canada border
  [-110.0, 49.0],
  [-100.0, 49.0],
  [-95.0, 49.0],
  [-87.5, 48.0], // Great Lakes
  [-83.0, 46.0],
  [-78.5, 43.5], // NY
  [-74.0, 45.0],
  [-69.0, 47.0], // Maine
  [-67.0, 44.8], // Eastport
  [-70.5, 41.7], // Cape Cod
  [-74.0, 40.5], // NY harbor
  [-75.0, 39.0],
  [-76.0, 37.0], // Virginia
  [-77.0, 34.5], // NC
  [-79.5, 33.0], // SC
  [-81.0, 31.5], // GA
  [-80.2, 25.2], // Miami / S FL
  [-81.5, 24.5], // Keys
  [-83.0, 28.5], // FL west
  [-84.5, 30.0],
  [-87.5, 30.0],
  [-89.5, 29.0], // MS
  [-91.5, 29.5], // LA
  [-94.0, 29.5], // TX coast
  [-97.5, 26.0], // Brownsville
  [-99.5, 27.5],
  [-103.0, 29.0], // Big Bend
  [-106.5, 31.8], // El Paso
  [-110.5, 31.3],
  [-114.7, 32.5], // AZ-CA
  [-117.3, 32.5], // San Diego
  [-118.5, 34.0], // LA
  [-121.0, 36.5],
  [-122.5, 37.8], // SF
  [-124.0, 40.5], // Cape Mendocino
  [-124.0, 44.5], // Oregon coast
  [-124.5, 47.5], // Washington coast
];

const N_OUTLINE = 80;

const indiaDense = densifyClosed(INDIA_VERTS, N_OUTLINE);
const usDense = densifyClosed(US_VERTS, N_OUTLINE);

export const INDIA_OUTLINE: [number, number, number][] = indiaDense.map(
  ([lng, lat]) => geoToScene(lat, lng, INDIA_BBOX)
);

export const US_OUTLINE: [number, number, number][] = usDense.map(
  ([lng, lat]) => geoToScene(lat, lng, US_BBOX)
);

// Highlight cities (rendered as brighter pulse particles inside the outline)
export const INDIA_HIGHLIGHTS = [
  { lat: 17.384, lng: 78.456 }, // Hyderabad
  { lat: 19.076, lng: 72.877 }, // Mumbai
  { lat: 28.6139, lng: 77.209 }, // Delhi
  { lat: 13.0827, lng: 80.2707 }, // Chennai
  { lat: 22.5726, lng: 88.3639 }, // Kolkata
].map(({ lat, lng }) => geoToScene(lat, lng, INDIA_BBOX));

export const US_HIGHLIGHTS = [
  { lat: 37.7749, lng: -122.4194 }, // SF
  { lat: 40.7128, lng: -74.006 }, // NYC
  { lat: 30.2672, lng: -97.7431 }, // Austin
  { lat: 47.6062, lng: -122.3321 }, // Seattle
  { lat: 42.3601, lng: -71.0589 }, // Boston
].map(({ lat, lng }) => geoToScene(lat, lng, US_BBOX));

export function indiaPos(lat: number, lng: number): [number, number, number] {
  return geoToScene(lat, lng, INDIA_BBOX);
}
export function usPos(lat: number, lng: number): [number, number, number] {
  return geoToScene(lat, lng, US_BBOX);
}

// Pre-resolved stop positions in local (region) coords
export const STOP_POS = {
  hyderabad: indiaPos(17.384, 78.456),
  overlandPark: usPos(38.982, -94.671),
  stLouis: usPos(38.627, -90.199),
  miami: usPos(25.721, -80.268),
  dallas: usPos(33.158, -96.824),
} as const;
