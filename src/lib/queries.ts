import sql from "./db";

export async function getUserByEmail(email: string) {
  const result = await sql`SELECT id FROM users WHERE email = ${email}`;
  return result[0]?.id;
}

export async function getUserProfilePictureById(id: string) {
  const result = await sql`
  SELECT profile_picture
  FROM users
  WHERE id = ${id}
  `;

  return result[0]?.profile_picture;
}

export async function getUserProfileById(id: string) {
  const result = await sql`
  SELECT first_name AS "firstName",
         last_name AS "lastName",
         email,
         profile_picture AS "profilePicture",
         bio,
         phone_number as "phoneNumber",
         location,
         COALESCE(
          jsonb_agg(
            jsonb_build_object('id', l.id, 'link', l.link)
          ) FILTER (WHERE l.id IS NOT NULL),
          '[]'::jsonb
         ) AS links
  FROM users u
  LEFT JOIN links l ON l.user_id = u.id
  WHERE u.id = ${id}
  GROUP BY first_name, last_name, email, profile_picture, bio, phone_number, location
  `;

  return result[0];
}

export async function getLinkOwnerById(id: number) {
  const result = await sql`
  SELECT user_id as "userId"
  FROM links
  WHERE id = ${id}
  `;

  return result[0].userId;
}
