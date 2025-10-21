import sql from "./db";
import { cleanString, formatDate } from "./utils";

export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  profile_picture: string
) {
  const result = await sql`
    INSERT INTO users (email, first_name, last_name, profile_picture)
    VALUES (${email}, ${firstName}, ${lastName}, ${profile_picture})
    RETURNING id;
  `;

  return result[0]?.id;
}

export async function updateUserBio(id: string, newBio: string) {
  await sql`
    UPDATE users
    SET bio = ${newBio}
    WHERE id = ${id}
    `;
}

export async function updateUserPhone(id: string, newPhone: string) {
  await sql`
  UPDATE users
  SET phone_number = ${newPhone}
  WHERE id = ${id}
  `;
}

export async function updateUserLocation(id: string, newLocation: string) {
  await sql`
  UPDATE users
  SET location = ${newLocation}
  WHERE id = ${id}
  `;
}

export async function updateUserName(
  id: string,
  firstName: string,
  lastName: string
) {
  await sql`
  UPDATE users
  SET first_name = ${firstName},
      last_name = ${lastName}
  WHERE id = ${id}
  `;
}

export async function updateProfilePicture(id: string, profilePicture: string) {
  await sql`
  UPDATE users
  SET profile_picture = ${profilePicture}
  WHERE id = ${id}
  `;
}

export async function addLink(link: string, userId: string) {
  await sql`
  INSERT INTO links
  (link, user_id)
  VALUES
  (${link}, ${userId})
  `;
}

export async function editLink(linkId: number, newLink: string) {
  await sql`
  UPDATE links
  SET link = ${newLink}
  WHERE id = ${linkId}
  `;
}

export async function deleteLink(id: number) {
  await sql`
  DELETE FROM links
  WHERE id = ${id}
  `;
}

export async function addEducation(
  userId: string,
  school: string,
  degree: string,
  description: string,
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  await sql`
  INSERT INTO educations
  (user_id, school, degree, description, start_date, end_date)
  VALUES
  (${userId}, ${cleanString(school)}, ${cleanString(degree)}, ${cleanString(
    description
  )}, ${formatDate(startMonth, startYear)}, ${formatDate(endMonth, endYear)})
  `;
}
