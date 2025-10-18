import sql from "./db";

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
