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

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  bio: string;
  phoneNumber: string;
  location: string;
  links: { id: number; link: string }[];
  educations: {
    id: number;
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills: { id: number; skill: string }[];
  languages: { id: number; name: string; proficiency: string }[];
  experiences: {
    id: number;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}

export async function getUserProfileById(id: string): Promise<Profile> {
  const result = await sql<Profile[]>`
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
    ) AS experiences,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', p.id, 'name', p.name, 'description', p.description, 'startDate', p.start_date, 'endDate', p.end_date
          )
        )
        FROM projects p
        WHERE p.user_id = u.id
      ), '[]'
    ) AS projects
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

export async function getProjectOwnerById(id: number) {
  const result = await sql`
  SELECT user_id as "userId"
  FROM projects
  WHERE id = ${id}
  `;

  return result[0].userId;
}

export interface CV {
  id: string;
  userId: string;
  url: string;
  title: string;
  hasPhoto: boolean;
  createdTimestamp: Date;
  modifiedTimestamp: Date;
}

export async function getCVsByUserId(userId: string, page: number = 1, limit: number = 12) {
  const offset = (page - 1) * limit;
  
  const result = await sql<CV[]>`
    SELECT 
      id,
      user_id as "userId",
      url,
      title,
      has_photo as "hasPhoto",
      created_timestamp as "createdTimestamp",
      modified_timestamp as "modifiedTimestamp"
    FROM cvs
    WHERE user_id = ${userId}
    ORDER BY created_timestamp DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return result;
}

export async function getTotalCVsByUserId(userId: string) {
  const result = await sql`
    SELECT COUNT(*) as count
    FROM cvs
    WHERE user_id = ${userId}
  `;

  return Number(result[0].count);
}

export async function getCVById(cvId: string) {
  const result = await sql<CV[]>`
    SELECT 
      id,
      user_id as "userId",
      url,
      title,
      has_photo as "hasPhoto",
      created_timestamp as "createdTimestamp",
      modified_timestamp as "modifiedTimestamp"
    FROM cvs
    WHERE id = ${cvId}
  `;

  return result[0];
}
