"use server";

import {
  updateUserBio as updateUserBioMutation,
  updateUserPhone as updateUserPhoneMutation,
  updateUserLocation as updateUserLocationMutation,
  updateUserName as updateUserNameMutation,
  addLink as addLinkMutation,
  deleteLink as deleteLinkMutation,
  editLink as editLinkLinkMutation,
} from "@/lib/mutations";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getLinkOwnerById } from "@/lib/queries";

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

export async function updateUserName(_initialState: any, formData: FormData) {
  const session = await auth();

  await updateUserNameMutation(
    session?.user?.id as string,
    formData.get("firstName") as string,
    formData.get("lastName") as string
  );

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
