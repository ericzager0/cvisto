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
    SELECT
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.email,
      u.profile_picture AS "profilePicture",
      u.bio,
      u.phone_number AS "phoneNumber",
      u.location,
      (
        SELECT jsonb_agg(jsonb_build_object('id', l.id, 'link', l.link))
        FROM links l
        WHERE l.user_id = u.id
      ) AS links,
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', e.id, 'school', e.school, 'degree', e.degree,
            'description', e.description, 'startDate', e.start_date, 'endDate', e.end_date
          )
        )
        FROM educations e
        WHERE e.user_id = u.id
      ) AS educations
    FROM users u
    WHERE u.id = ${id};
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

export async function getEducationOwnerById(id: number) {
  const result = await sql`
  SELECT user_id as "userId"
  FROM educations
  WHERE id = ${id}
  `;

  return result[0].userId;
}
