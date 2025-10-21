"use server";

import {
  updateUserBio as updateUserBioMutation,
  updateUserPhone as updateUserPhoneMutation,
  updateUserLocation as updateUserLocationMutation,
  updateUserName as updateUserNameMutation,
  addLink as addLinkMutation,
  deleteLink as deleteLinkMutation,
  editLink as editLinkLinkMutation,
  updateProfilePicture as updateProfilePictureMutation,
  addEducation as addEducationMutation,
} from "@/lib/mutations";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getLinkOwnerById } from "@/lib/queries";
import cloudinary from "@/lib/cloudinary";

export async function updateUserBio(_initialState: any, formData: FormData) {
  const session = await auth();

  await updateUserBioMutation(
    session?.user?.id as string,
    formData.get("bio") as string
  );

  revalidatePath("/profile");

  return { success: true };
}

export async function updateUserPhone(_initialState: any, formData: FormData) {
  const session = await auth();

  await updateUserPhoneMutation(
    session?.user?.id as string,
    formData.get("phone") as string
  );

  revalidatePath("/profile");
  return { success: true };
}

export async function updateUserLocation(
  _initialState: any,
  formData: FormData
) {
  const session = await auth();

  await updateUserLocationMutation(
    session?.user?.id as string,
    formData.get("location") as string
  );

  revalidatePath("/profile");
  return { success: true };
}

export async function updateProfile(_initialState: any, formData: FormData) {
  const session = await auth();

  await updateUserNameMutation(
    session?.user?.id as string,
    formData.get("firstName") as string,
    formData.get("lastName") as string
  );

  const file = formData.get("picture") as File | null;

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "cvisto",
          resource_type: "image",
          public_id: `user-${session?.user?.id}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });
    const imageUrl = (uploadResult as any).secure_url;

    await updateProfilePictureMutation(session?.user?.id as string, imageUrl);
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function addLink(_initialState: any, formData: FormData) {
  const session = await auth();

  await addLinkMutation(
    formData.get("link") as string,
    session?.user?.id as string
  );

  revalidatePath("/profile");
  return { success: true };
}

export async function editLink(_initialState: any, formData: FormData) {
  const session = await auth();

  const linkId = Number(formData.get("linkId"));

  const linkOwnerId = await getLinkOwnerById(linkId);

  if (session?.user?.id === linkOwnerId) {
    await editLinkLinkMutation(linkId, formData.get("link") as string);
    revalidatePath("/profile");
    return { success: true };
  }

  return { success: false };
}

export async function deleteLink(linkId: number) {
  const session = await auth();
  const linkOwnerId = await getLinkOwnerById(linkId);

  if (session?.user?.id === linkOwnerId) {
    await deleteLinkMutation(linkId);
    revalidatePath("/profile");
    return { success: true };
  }

  return { success: false };
}

export async function addEducation(_initialState: any, formData: FormData) {
  const session = await auth();

  await addEducationMutation(
    session?.user?.id as string,
    formData.get("school") as string,
    formData.get("degree") as string,
    formData.get("description") as string,
    formData.get("startYear") as string,
    formData.get("startMonth") as string,
    formData.get("endYear") as string,
    formData.get("endMonth") as string
  );

  revalidatePath("/profile");
  return { success: true };
}
