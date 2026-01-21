export interface Review {
  id: string;
  rating: number;
  text: string;
  author: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: { ru: string; et: string };
  type: 'Repair' | 'Car Wash' | 'Detailing' | 'Tire Change';
  city: 'Tallinn' | 'Tartu' | 'Narva' | 'Pärnu';
  address: string;
  rating: number;
  reviewsCount: number;
  priceFrom: number;
  description: { ru: string; et: string };
  image: string;
  phone?: string;
  website?: string;
  reviews?: Review[];
  workingHours?: {
    mon?: string;
    tue?: string;
    wed?: string;
    thu?: string;
    fri?: string;
    sat?: string;
    sun?: string;
  };
}

export const services: Service[] = [];
