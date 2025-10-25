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

export async function addSkill(skill: string, userId: string) {
  await sql`
  INSERT INTO skills
  (skill, user_id)
  VALUES
  (${skill}, ${userId})
  `;
}

export async function editSkill(skillId: number, newSkill: string) {
  await sql`
  UPDATE skills
  SET skill = ${newSkill}
  WHERE id = ${skillId}
  `;
}

export async function deleteSkill(id: number) {
  await sql`
  DELETE FROM skills
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

export async function editEducation(
  id: number,
  school: string,
  degree: string,
  description: string,
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  await sql`
  UPDATE educations
  SET school = ${school},
      degree = ${degree},
      description = ${description},
      start_date = ${formatDate(startMonth, startYear)},
      end_date = ${formatDate(endMonth, endYear)}
  WHERE id = ${id}
  `;
}

export async function deleteEducation(id: number) {
  await sql`
  DELETE FROM educations
  WHERE id = ${id}
  `;
}

export async function addCV(id: string, userId: string, url: string) {
  await sql`
  INSERT INTO cvs
  (id, user_id, url)
  VALUES
  (${id}, ${userId}, ${url})
  `;
}

export async function addLanguage(
  userId: string,
  languageName: string,
  languageProficiency?: string
) {
  await sql`
  INSERT INTO languages
  (user_id, name, proficiency)
  VALUES
  (${userId}, ${languageName}, ${
    languageProficiency ? languageProficiency : null
  })
  `;
}

export async function editLanguage(
  id: number,
  languageName: string,
  languageProficiency: string
) {
  await sql`
  UPDATE languages
  SET name = ${languageName},
      proficiency = ${languageProficiency ? languageProficiency : null}
  WHERE id = ${id}
  `;
}

export async function deleteLanguage(id: number) {
  await sql`
  DELETE FROM languages
  WHERE id = ${id}
  `;
}
