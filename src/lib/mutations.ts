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

export async function addCV(
  id: string,
  userId: string,
  url: string,
  title: string,
  hasPhoto: boolean,
  analysisData?: any,
  cvData?: any
) {
  await sql`
  INSERT INTO cvs
  (id, user_id, url, title, has_photo, analysis_data, cv_data)
  VALUES
  (${id}, ${userId}, ${url}, ${title}, ${hasPhoto}, ${analysisData ? sql.json(analysisData) : null}, ${cvData ? sql.json(cvData) : null})
  `;
}

export async function deleteCV(cvId: string) {
  await sql`
  DELETE FROM cvs
  WHERE id = ${cvId}
  `;
}

export async function updateCV(
  cvId: string,
  cvData: any,
  url?: string
) {
  const updateFields: any = {
    cv_data: sql.json(cvData),
    modified_timestamp: sql`CURRENT_TIMESTAMP`
  };

  if (url) {
    updateFields.url = url;
  }

  await sql`
    UPDATE cvs
    SET ${sql(updateFields)}
    WHERE id = ${cvId}
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

export async function addExperience(
  userId: string,
  title: string,
  company: string,
  description: string,
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  await sql`
  INSERT INTO experiences
  (user_id, title, company, description, start_date, end_date)
  VALUES
  (${userId}, ${cleanString(title)}, ${cleanString(company)}, ${cleanString(
    description
  )}, ${formatDate(startMonth, startYear)}, ${formatDate(endMonth, endYear)})
  `;
}

export async function editExperience(
  id: number,
  title: string,
  company: string,
  description: string,
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  await sql`
  UPDATE experiences
  SET title = ${title},
      company = ${company},
      description = ${description},
      start_date = ${formatDate(startMonth, startYear)},
      end_date = ${formatDate(endMonth, endYear)}
  WHERE id = ${id}
  `;
}

export async function deleteExperience(id: number) {
  await sql`
  DELETE FROM experiences
  WHERE id = ${id}
  `;
}

export async function addProject(
  userId: string,
  name: string,
  description: string,
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  await sql`
  INSERT INTO projects
  (user_id, name, description, start_date, end_date)
  VALUES
  (${userId}, ${cleanString(name)}, ${cleanString(description)}, ${formatDate(
    startMonth,
    startYear
  )}, ${formatDate(endMonth, endYear)})
  `;
}

export async function editProject(
  id: number,
  name: string,
  description: string,
  startYear: string,
  startMonth: string,
  endYear: string,
  endMonth: string
) {
  await sql`
  UPDATE projects
  SET name = ${cleanString(name)},
      description = ${cleanString(description)},
      start_date = ${formatDate(startMonth, startYear)},
      end_date = ${formatDate(endMonth, endYear)}
  WHERE id = ${id}
  `;
}

export async function deleteProject(id: number) {
  await sql`
  DELETE FROM projects
  WHERE id = ${id}
  `;
}

// Job Applications
export async function createJobApplication(data: {
  userId: string;
  jobTitle: string;
  company: string;
  location?: string;
  jobUrl?: string;
  status?: string;
  appliedDate?: string;
  salary?: string;
  notes?: string;
  nextStep?: string;
  nextStepDate?: string;
}) {
  const result = await sql`
    INSERT INTO job_applications (
      user_id,
      job_title,
      company,
      location,
      job_url,
      status,
      applied_date,
      salary,
      notes,
      next_step,
      next_step_date
    )
    VALUES (
      ${data.userId},
      ${data.jobTitle},
      ${data.company},
      ${data.location || null},
      ${data.jobUrl || null},
      ${data.status || 'applied'},
      ${data.appliedDate || new Date().toISOString().split('T')[0]},
      ${data.salary || null},
      ${data.notes || null},
      ${data.nextStep || null},
      ${data.nextStepDate || null}
    )
    RETURNING id
  `;

  return result[0]?.id;
}

export async function updateJobApplication(
  id: string,
  data: {
    status?: string;
    salary?: string;
    notes?: string;
    nextStep?: string;
    nextStepDate?: string;
  }
) {
  const updates: string[] = [];
  const values: any[] = [];

  if (data.status !== undefined) {
    updates.push(`status = $${values.length + 1}`);
    values.push(data.status);
  }
  if (data.salary !== undefined) {
    updates.push(`salary = $${values.length + 1}`);
    values.push(data.salary);
  }
  if (data.notes !== undefined) {
    updates.push(`notes = $${values.length + 1}`);
    values.push(data.notes);
  }
  if (data.nextStep !== undefined) {
    updates.push(`next_step = $${values.length + 1}`);
    values.push(data.nextStep);
  }
  if (data.nextStepDate !== undefined) {
    updates.push(`next_step_date = $${values.length + 1}`);
    values.push(data.nextStepDate);
  }

  if (updates.length === 0) return;

  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);

  const query = `
    UPDATE job_applications
    SET ${updates.join(', ')}
    WHERE id = $${values.length}
  `;

  await sql.unsafe(query, values);
}

export async function deleteJobApplication(id: string) {
  await sql`
    DELETE FROM job_applications
    WHERE id = ${id}
  `;
}

export async function updateRecommendedPositions(userId: string, positions: string[]) {
  await sql`
    UPDATE users
    SET recommended_positions = ${sql.json(positions)}
    WHERE id = ${userId}
  `;
}

export async function updateProfileEnhancement(userId: string, data: any) {
  await sql`
    UPDATE users
    SET profile_enhancement = ${sql.json(data)}
    WHERE id = ${userId}
  `;
}
