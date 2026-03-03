/**
 * Dummy listings for /listings when backend is offline. Uses car images from components/images.
 */

import img0 from '../components/images/image.png';
import img1 from '../components/images/image (1).png';
import img5 from '../components/images/image (5).png';
import img6 from '../components/images/image (6).png';
import img7 from '../components/images/image (7).png';
import img8 from '../components/images/image (8).png';
import img9 from '../components/images/image (9).png';
import img10 from '../components/images/image (10).png';
import img11 from '../components/images/image (11).png';
import img12 from '../components/images/image (12).png';
import img13 from '../components/images/image (13).png';

const shuffled = [img7, img1, img12, img9, img0, img11, img5, img13, img6, img10, img8, img1, img0, img12, img9, img7, img11, img5, img13, img6];

export const DUMMY_LISTINGS_RAW = [
  { title: '2014 Jeep Grand Cherokee Overland', year: 2014, bodyType: 'suv', price: 19000, mileage: 85000, fuelType: 'petrol', make: 'Jeep', model: 'Grand Cherokee' },
  { title: '2014 Nissan Pathfinder SV', year: 2014, bodyType: 'suv', price: 25000, mileage: 72000, fuelType: 'petrol', make: 'Nissan', model: 'Pathfinder' },
  { title: '2015 Mercedes-Benz S500', year: 2015, bodyType: 'sedan', price: 75000, mileage: 45000, fuelType: 'petrol', make: 'Mercedes-Benz', model: 'S500' },
  { title: '2020 Mini Cooper S', year: 2020, bodyType: 'hatchback', price: 63000, mileage: 22000, fuelType: 'petrol', make: 'Mini', model: 'Cooper S' },
  { title: '2019 Honda Civic Hatchback', year: 2019, bodyType: 'hatchback', price: 32000, mileage: 38000, fuelType: 'petrol', make: 'Honda', model: 'Civic' },
  { title: '2021 Toyota Yaris', year: 2021, bodyType: 'hatchback', price: 28000, mileage: 15000, fuelType: 'petrol', make: 'Toyota', model: 'Yaris' },
  { title: '2020 Volkswagen Golf GTI', year: 2020, bodyType: 'hatchback', price: 47000, mileage: 28000, fuelType: 'petrol', make: 'Volkswagen', model: 'Golf GTI' },
  { title: '2018 Ford Fiesta ST', year: 2018, bodyType: 'hatchback', price: 22000, mileage: 52000, fuelType: 'petrol', make: 'Ford', model: 'Fiesta ST' },
  { title: '2022 Toyota Camry XSE', year: 2022, bodyType: 'sedan', price: 55000, mileage: 12000, fuelType: 'petrol', make: 'Toyota', model: 'Camry' },
  { title: '2021 BMW 3 Series 330i', year: 2021, bodyType: 'sedan', price: 78000, mileage: 18000, fuelType: 'petrol', make: 'BMW', model: '3 Series' },
  { title: '2020 Honda Accord Sport', year: 2020, bodyType: 'sedan', price: 42000, mileage: 35000, fuelType: 'petrol', make: 'Honda', model: 'Accord' },
  { title: '2019 Hyundai Sonata SEL', year: 2019, bodyType: 'sedan', price: 31000, mileage: 48000, fuelType: 'petrol', make: 'Hyundai', model: 'Sonata' },
  { title: '2021 Toyota Innova Crysta', year: 2021, bodyType: 'muv', price: 48000, mileage: 25000, fuelType: 'diesel', make: 'Toyota', model: 'Innova' },
  { title: '2020 Kia Carnival EX', year: 2020, bodyType: 'muv', price: 61000, mileage: 30000, fuelType: 'petrol', make: 'Kia', model: 'Carnival' },
  { title: '2019 Honda Odyssey EX-L', year: 2019, bodyType: 'muv', price: 53000, mileage: 42000, fuelType: 'petrol', make: 'Honda', model: 'Odyssey' },
  { title: '2022 Mitsubishi Xpander', year: 2022, bodyType: 'muv', price: 38000, mileage: 8000, fuelType: 'petrol', make: 'Mitsubishi', model: 'Xpander' },
  { title: '2022 Mercedes-Benz GLE 450', year: 2022, bodyType: 'suv', price: 145000, mileage: 14000, fuelType: 'petrol', make: 'Mercedes-Benz', model: 'GLE' },
  { title: '2021 BMW X7 xDrive40i', year: 2021, bodyType: 'suv', price: 162000, mileage: 22000, fuelType: 'petrol', make: 'BMW', model: 'X7' },
  { title: '2023 Porsche Cayenne S', year: 2023, bodyType: 'suv', price: 198000, mileage: 5000, fuelType: 'petrol', make: 'Porsche', model: 'Cayenne' },
  { title: '2022 Range Rover Sport HSE', year: 2022, bodyType: 'suv', price: 175000, mileage: 10000, fuelType: 'diesel', make: 'Land Rover', model: 'Range Rover Sport' },
];

const counts = [6, 4, 6, 8, 5, 4, 7, 3, 6, 9, 5, 4, 5, 7, 6, 4, 10, 8, 12, 9];

export function buildDummyListings() {
  return DUMMY_LISTINGS_RAW.map((row, i) => {
    const url = shuffled[i];
    const images = Array.from({ length: counts[i] }, (_, j) => ({ url, thumbnail: url, isPrimary: j === 0 }));
    return {
      _id: `dummy-${i + 1}`,
      ...row,
      currency: 'QAR',
      mileageUnit: 'km',
      condition: 'excellent',
      isFeatured: i % 3 === 0,
      dealer: { businessName: 'ALVIO Demo Dealer' },
      images,
    };
  });
}

export function getDummyListingById(id) {
  const list = buildDummyListings();
  return list.find((l) => l._id === id) || null;
}

export function filterAndPaginateDummy(listings, params) {
  const limit = Math.min(Number(params.limit) || 12, 50);
  const page = Number(params.page) || 1;
  let list = [...listings];

  const q = (params.q || '').toLowerCase().trim();
  if (q) {
    list = list.filter((l) =>
      (l.title || '').toLowerCase().includes(q) ||
      (l.make || '').toLowerCase().includes(q) ||
      (l.model || '').toLowerCase().includes(q)
    );
  }
  if (params.bodyType) list = list.filter((l) => (l.bodyType || '') === params.bodyType);
  if (params.fuelType) list = list.filter((l) => (l.fuelType || '') === params.fuelType);
  if (params.make) list = list.filter((l) => (l.make || '').toLowerCase().includes(params.make.toLowerCase()));
  if (params.model) list = list.filter((l) => (l.model || '').toLowerCase().includes(params.model.toLowerCase()));
  if (params.minPrice) list = list.filter((l) => l.price >= Number(params.minPrice));
  if (params.maxPrice) list = list.filter((l) => l.price <= Number(params.maxPrice));

  const total = list.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const pageSafe = Math.max(1, Math.min(page, totalPages));
  const data = list.slice((pageSafe - 1) * limit, pageSafe * limit);

  return { data, pagination: { total, page: pageSafe, totalPages, limit } };
}
