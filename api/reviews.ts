import { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { businessId, rating, comment, authorName, userId: clerkUserId, userEmail: clerkUserEmail } = req.body;

  if (!businessId || !rating || !comment || !authorName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log('Adding review for business:', businessId, 'by:', authorName);

    // Find or create a user in our DB
    let userId;
    
    if (clerkUserId) {
      // 1. Try to find by Clerk ID
      const dbUserById = await sql`SELECT id FROM "User" WHERE id = ${clerkUserId} LIMIT 1`;
      
      if (dbUserById.length > 0) {
        userId = dbUserById[0].id;
        console.log('Found user by Clerk ID:', userId);
      } else {
        // 2. Try to find by Email (to merge guest/old accounts)
        const dbUserByEmail = await sql`SELECT id FROM "User" WHERE email = ${clerkUserEmail} LIMIT 1`;
        
        if (dbUserByEmail.length > 0) {
          const oldId = dbUserByEmail[0].id;
          userId = clerkUserId;
          console.log('Found user by Email, merging:', oldId, '->', userId);
          
          // Update references in Reviews and then update the User ID
          await sql`UPDATE "Review" SET "userId" = ${userId} WHERE "userId" = ${oldId}`;
          await sql`UPDATE "User" SET id = ${userId}, role = 'USER', name = ${authorName}, "updatedAt" = NOW() WHERE id = ${oldId}`;
        } else {
          // 3. New user
          userId = clerkUserId;
          console.log('Creating new user from Clerk:', userId);
          await sql`
            INSERT INTO "User" (id, name, email, "updatedAt", role)
            VALUES (${userId}, ${authorName}, ${clerkUserEmail || `${clerkUserId}@clerk.local`}, NOW(), 'USER')
          `;
        }
      }
    } else {
      // Legacy/Guest lookup (optional: you could require login here)
      const userRows = await sql`SELECT id FROM "User" WHERE name ILIKE ${authorName} LIMIT 1`;
      if (userRows.length === 0) {
        userId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const guestEmail = `guest_${userId}@autotop.ee`; 
        await sql`
          INSERT INTO "User" (id, name, email, "updatedAt", role)
          VALUES (${userId}, ${authorName}, ${guestEmail}, NOW(), 'GUEST')
        `;
      } else {
        userId = userRows[0].id;
      }
    }

    // 2. Insert the review
    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('Inserting review:', reviewId);
    
    await sql`
      INSERT INTO "Review" (id, "businessId", "userId", rating, comment, status, "updatedAt")
      VALUES (${reviewId}, ${businessId}, ${userId}, ${parseInt(rating)}, ${comment}, 'APPROVED', NOW())
    `;

    return res.status(201).json({ 
      id: reviewId, 
      author: authorName, 
      rating: parseInt(rating), 
      text: comment, 
      createdAt: new Date().toISOString() 
    });
  } catch (err: any) {
    console.error('CRITICAL: Failed to add review:', err);
    return res.status(500).json({ 
      error: 'Failed to add review', 
      message: err.message,
      code: err.code
    });
  }
}
