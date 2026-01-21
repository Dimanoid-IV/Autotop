import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const categoryMap: Record<string, string> = {
  'auto-service': 'Repair',
  'auto-repair': 'Repair',
  'car-wash': 'Car Wash',
  'detailing': 'Detailing',
  'service-station': 'Repair',
};

const defaultImages: Record<string, string> = {
  'Repair': 'https://images.unsplash.com/photo-1486006396193-4710368a0b44?auto=format&fit=crop&w=600&q=80',
  'Car Wash': 'https://images.unsplash.com/photo-1613214149174-5d421769cf30?auto=format&fit=crop&w=600&q=80',
  'Detailing': 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?auto=format&fit=crop&w=600&q=80',
  'Tire Change': 'https://images.unsplash.com/photo-1578844541737-29c580a1ae74?auto=format&fit=crop&w=600&q=80',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    if (id) {
      const rows = await sql`
        SELECT 
          b.id, b.name, b.description, b.address, b.phone, b.website,
          c.name as "cityName",
          cat.slug as "catSlug",
          COALESCE(AVG(r.rating), 0) as "avgRating",
          COUNT(r.id) as "reviewsCount"
        FROM "Business" b
        LEFT JOIN "City" c ON b."cityId" = c.id
        LEFT JOIN "Category" cat ON b."categoryId" = cat.id
        LEFT JOIN "Review" r ON b.id = r."businessId"
        WHERE b.id = ${id as string}
        GROUP BY b.id, b.name, b.description, b.address, b.phone, b.website, c.name, cat.slug
      `;

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const row = rows[0];
      const type = categoryMap[row.catSlug] || 'Repair';
      
      // Fetch reviews for this business
      const reviews = await sql`
        SELECT r.id, r.rating, r.comment as "text", r."createdAt", u.name as "author"
        FROM "Review" r
        LEFT JOIN "User" u ON r."userId" = u.id
        WHERE r."businessId" = ${id as string} AND r.status = 'APPROVED'
        ORDER BY r."createdAt" DESC
      `;
      
      return res.status(200).json({
        id: row.id,
        name: { ru: row.name, et: row.name }, 
        type: type,
        city: row.cityName,
        address: row.address,
        rating: parseFloat(parseFloat(row.avgRating).toFixed(1)) || 0,
        reviewsCount: parseInt(row.reviewsCount),
        priceFrom: 25,
        description: { 
          ru: row.description || 'Описание временно отсутствует.', 
          et: row.description || 'Kirjeldus puudub.' 
        },
        image: defaultImages[type],
        phone: row.phone,
        website: row.website,
        reviews: reviews
      });
    }

    // We fetch a larger pool of services and sort them by review count/rating
    // to ensure we get the most relevant ones in the initial set.
    // Frontend handles specific filtering for now.
    const rows = await sql`
      SELECT 
        b.id, b.name, b.description, b.address, b.phone, b.website,
        c.name as "cityName",
        cat.slug as "catSlug",
        COALESCE(AVG(r.rating), 0) as "avgRating",
        COUNT(r.id) as "reviewsCount"
      FROM "Business" b
      LEFT JOIN "City" c ON b."cityId" = c.id
      LEFT JOIN "Category" cat ON b."categoryId" = cat.id
      LEFT JOIN "Review" r ON b.id = r."businessId"
      GROUP BY b.id, b.name, b.description, b.address, b.phone, b.website, c.name, cat.slug
      ORDER BY "reviewsCount" DESC, "avgRating" DESC
      LIMIT 300
    `;

    const services = rows.map(row => {
      const type = categoryMap[row.catSlug] || 'Repair';
      return {
        id: row.id,
        name: { ru: row.name, et: row.name },
        type: type,
        city: row.cityName,
        address: row.address,
        rating: parseFloat(parseFloat(row.avgRating).toFixed(1)) || 4.5,
        reviewsCount: parseInt(row.reviewsCount),
        priceFrom: 25,
        description: { 
          ru: row.description || '', 
          et: row.description || '' 
        },
        image: defaultImages[type],
        phone: row.phone,
        website: row.website,
        workingHours: {
          mon: '09:00-18:00',
          tue: '09:00-18:00',
          wed: '09:00-18:00',
          thu: '09:00-18:00',
          fri: '09:00-18:00',
          sat: '10:00-15:00',
          sun: 'Closed'
        }
      };
    });

    return res.status(200).json(services);
  } catch (err: any) {
    console.error('API Error details:', {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message,
      hasDbUrl: !!process.env.DATABASE_URL 
    });
  }
}
