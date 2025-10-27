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

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  bio: string | null;
  phoneNumber: string | null;
  location: string | null;
  links: { id: string; link: string }[];
  educations: {
    id: string;
    school: string;
    degree: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];
  skills: { id: string; skill: string }[];
  languages: { id: string; name: string; proficiency: string }[];
  experiences: {
    id: string;
    title: string;
    company: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
  }[];
};

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
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', l.id, 'link', l.link))
        FROM links l
        WHERE l.user_id = u.id
      ), '[]'
    ) AS links,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', e.id, 'school', e.school, 'degree', e.degree,
            'description', e.description, 'startDate', e.start_date, 'endDate', e.end_date
          )
        )
        FROM educations e
        WHERE e.user_id = u.id
      ), '[]'
    ) AS educations,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', s.id, 'skill', s.skill))
        FROM skills s
        WHERE s.user_id = u.id
      ), '[]'
    ) AS skills,
    COALESCE(
      (
        SELECT jsonb_agg(jsonb_build_object('id', l.id, 'name', l.name, 'proficiency', l.proficiency))
        FROM languages l
        WHERE l.user_id = u.id
      ), '[]'
    ) AS languages,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', e.id, 'title', e.title, 'company', e.company,
            'description', e.description, 'startDate', e.start_date, 'endDate', e.end_date
          )
        )
        FROM experiences e
        WHERE e.user_id = u.id
      ), '[]'
    ) AS experiences
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

export async function getSkillOwnerById(id: number) {
  const result = await sql`
  SELECT user_id as "userId"
  FROM skills
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

export async function getExperienceOwnerById(id: number) {
  const result = await sql`
  SELECT user_id as "userId"
  FROM experiences
  WHERE id = ${id}
  `;

  return result[0].userId;
}

export async function getCVs(userId: string) {
  const result = await sql`
  SELECT id, user_id, url
  FROM cvs
  WHERE user_id = ${userId}
  `;

  return result;
}

export async function getLanguageOwnerById(id: number) {
  const result = await sql`
  SELECT user_id as "userId"
  FROM languages
  WHERE id = ${id}
  `;

  return result[0].userId;
}
