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
  editEducation as editEducationMutation,
  deleteEducation as deleteEducationMutation,
  addSkill as addSkillMutation,
  deleteSkill as deleteSkillMutation,
  addCV as addCVMutation,
  deleteCV as deleteCVMutation,
  addLanguage as addLanguageMutation,
  editLanguage as editLanguageMutation,
  deleteLanguage as deleteLanguageMutation,
  addExperience as addExperienceMutation,
  editExperience as editExperienceMutation,
  deleteExperience as deleteExperienceMutation,
  addProject as addProjectMutation,
  editProject as editProjectMutation,
  deleteProject as deleteProjectMutation,
} from "@/lib/mutations";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  getEducationOwnerById,
  getLinkOwnerById,
  getSkillOwnerById,
  getLanguageOwnerById,
  getExperienceOwnerById,
  getProjectOwnerById,
  getCVById,
} from "@/lib/queries";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

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

export async function editEducation(_initialState: any, formData: FormData) {
  const session = await auth();

  const educationId = Number(formData.get("educationId"));
  const educationOwnerId = await getEducationOwnerById(educationId);

  if (session?.user?.id === educationOwnerId) {
    await editEducationMutation(
      educationId,
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

  return { success: false };
}

export async function deleteEducation(educationId: number) {
  const session = await auth();
  const educationOwnerId = await getEducationOwnerById(educationId);

  if (session?.user?.id === educationOwnerId) {
    await deleteEducationMutation(educationId);
    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function addExperience(_initialState: any, formData: FormData) {
  const session = await auth();

  await addExperienceMutation(
    session?.user?.id as string,
    formData.get("title") as string,
    formData.get("company") as string,
    formData.get("description") as string,
    formData.get("startYear") as string,
    formData.get("startMonth") as string,
    formData.get("endYear") as string,
    formData.get("endMonth") as string
  );

  revalidatePath("/profile");

  return { success: true };
}

export async function editExperience(_initialState: any, formData: FormData) {
  const session = await auth();

  const experienceId = Number(formData.get("experienceId"));
  const experienceOwnerId = await getExperienceOwnerById(experienceId);

  if (session?.user?.id === experienceOwnerId) {
    await editExperienceMutation(
      experienceId,
      formData.get("title") as string,
      formData.get("company") as string,
      formData.get("description") as string,
      formData.get("startYear") as string,
      formData.get("startMonth") as string,
      formData.get("endYear") as string,
      formData.get("endMonth") as string
    );

    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function deleteExperience(experienceId: number) {
  const session = await auth();
  const experienceOwnerId = await getExperienceOwnerById(experienceId);

  if (session?.user?.id === experienceOwnerId) {
    await deleteExperienceMutation(experienceId);
    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function addProject(_initialState: any, formData: FormData) {
  const session = await auth();

  await addProjectMutation(
    session?.user?.id as string,
    formData.get("name") as string,
    formData.get("description") as string,
    formData.get("startYear") as string,
    formData.get("startMonth") as string,
    formData.get("endYear") as string,
    formData.get("endMonth") as string
  );

  revalidatePath("/profile");

  return { success: true };
}

export async function editProject(_initialState: any, formData: FormData) {
  const session = await auth();

  const projectId = Number(formData.get("projectId"));
  const projectOwnerId = await getProjectOwnerById(projectId);

  if (session?.user?.id === projectOwnerId) {
    await editProjectMutation(
      projectId,
      formData.get("name") as string,
      formData.get("description") as string,
      formData.get("startYear") as string,
      formData.get("startMonth") as string,
      formData.get("endYear") as string,
      formData.get("endMonth") as string
    );

    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function deleteProject(projectId: number) {
  const session = await auth();
  const projectOwnerId = await getProjectOwnerById(projectId);

  if (session?.user?.id === projectOwnerId) {
    await deleteProjectMutation(projectId);
    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function addSkill(_initialState: any, formData: FormData) {
  const session = await auth();

  await addSkillMutation(
    formData.get("skill") as string,
    session?.user?.id as string
  );

  revalidatePath("/profile");

  return { success: true };
}

export async function deleteSkill(skillId: number) {
  const session = await auth();
  const skillOwnerId = await getSkillOwnerById(skillId);

  if (session?.user?.id === skillOwnerId) {
    await deleteSkillMutation(skillId);
    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function addCV(_initialState: any, formData: FormData) {
  const session = await auth();
  const file = formData.get("cv") as File | null;

  if (!file || file.size === 0) {
    return { success: false };
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
    };
  }

  const newId = uuidv4();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileExtension = file.type === "application/pdf" ? "pdf" : "docx";
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "cvisto",
        resource_type: "raw",
        public_id: `cv-${newId}`,
        format: fileExtension,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

  const newUrl = (uploadResult as any).secure_url;

  await addCVMutation(newId, session?.user?.id as string, newUrl, file.name, false);
  revalidatePath("/profile");

  return { success: true };
}

export async function addLanguage(_initialState: any, formData: FormData) {
  const session = await auth();

  await addLanguageMutation(
    session?.user?.id as string,
    formData.get("name") as string,
    formData.get("proficiency") as string
  );

  revalidatePath("/profile");

  return { success: true };
}

export async function editLanguage(_initialState: any, formData: FormData) {
  const session = await auth();
  const languageId = Number(formData.get("languageId"));
  const languageOwnerId = await getLanguageOwnerById(languageId);

  if (session?.user?.id === languageOwnerId) {
    await editLanguageMutation(
      languageId,
      formData.get("name") as string,
      formData.get("proficiency") as string
    );

    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function deleteLanguage(languageId: number) {
  const session = await auth();
  const languageOwnerId = await getLanguageOwnerById(languageId);

  if (session?.user?.id === languageOwnerId) {
    await deleteLanguageMutation(languageId);
    revalidatePath("/profile");

    return { success: true };
  }

  return { success: false };
}

export async function generateCvData(profile: any, analysis: any) {
  console.log("Acción de Servidor: 'generateCvData' iniciada.");
  
  // Importar dinámicamente la función de lógica del endpoint
  const { generateCvDataLogic } = await import("@/app/api/generate-cv-data/route");
  
  try {
    console.log("Acción de Servidor: Llamando a la lógica de generación...");
    const cvData = await generateCvDataLogic(profile, analysis);
    console.log("Acción de Servidor: Datos del CV generados exitosamente.");
    return cvData;
  } catch (error) {
    console.error("Acción de Servidor: Error al generar datos del CV:", error);
    throw error;
  }
}

export async function generateAndSaveCv(
  profile: any,
  analysis: any,
  cvName: string,
  includePhoto: boolean,
  docxBuffer: ArrayBuffer,
  cvData: any
) {
  console.log("Acción de Servidor: 'generateAndSaveCv' iniciada.");
  
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado");
  }

  try {
    // Importar la función de upload
    const { uploadCVToCloudinary } = await import("@/lib/cloudinary");
    
    // Generar ID único para el CV
    const cvId = uuidv4();
    
    // Convertir ArrayBuffer a Buffer
    const buffer = Buffer.from(docxBuffer);
    
    // Subir a Cloudinary (el nombre se construye dentro de uploadCVToCloudinary)
    console.log("Subiendo CV a Cloudinary...");
    const cloudinaryUrl = await uploadCVToCloudinary(
      buffer,
      session.user.id,
      cvName
    );
    
    // Guardar en la base de datos con analysis y cvData
    console.log("Guardando CV en la base de datos...");
    await addCVMutation(
      cvId, 
      session.user.id, 
      cloudinaryUrl, 
      cvName, 
      includePhoto,
      analysis,
      cvData
    );
    
    console.log("CV guardado exitosamente:", { cvId, url: cloudinaryUrl });
    
    revalidatePath("/cvs");
    
    return { success: true, cvId, url: cloudinaryUrl };
  } catch (error) {
    console.error("Error al generar y guardar CV:", error);
    throw error;
  }
}

export async function deleteCVAction(cvId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Usuario no autenticado" };
  }

  try {
    // Verificar que el CV pertenezca al usuario
    const cv = await getCVById(cvId);
    if (!cv || cv.userId !== session.user.id) {
      return { success: false, error: "CV no encontrado o no autorizado" };
    }

    // Extraer el public_id de la URL de Cloudinary
    // URL ejemplo: https://res.cloudinary.com/dl8hanqpm/raw/upload/v1761757959/cvs/userId/CV_20251029153045_Name.docx
    const urlParts = cv.url.split('/');
    const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
    if (versionIndex !== -1) {
      // Obtener todo después de la versión (cvs/userId/filename.docx)
      const pathAfterVersion = urlParts.slice(versionIndex + 1).join('/');
      // Para archivos raw, el public_id debe incluir la extensión
      const publicId = pathAfterVersion;
      
      console.log("=== ELIMINANDO CV DE CLOUDINARY ===");
      console.log("URL:", cv.url);
      console.log("Public ID:", publicId);
      
      // Eliminar de Cloudinary
      try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log("Resultado de eliminación de Cloudinary:", result);
      } catch (cloudinaryError) {
        console.error("Error al eliminar de Cloudinary:", cloudinaryError);
        // Continuar con la eliminación de la BD aunque falle Cloudinary
      }
    }

    // Eliminar de la base de datos
    await deleteCVMutation(cvId);
    
    revalidatePath("/cvs");
    
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar CV:", error);
    return { success: false, error: "Error al eliminar el CV" };
  }
}

export async function updateCVAction(cvId: string, updatedCvData: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Usuario no autenticado" };
  }

  try {
    // Verificar que el CV pertenezca al usuario
    const cv = await getCVById(cvId);
    if (!cv || cv.userId !== session.user.id) {
      return { success: false, error: "CV no encontrado o no autorizado" };
    }

    // Regenerar el DOCX con los datos actualizados
    const { generateCVDocument } = await import("@/lib/cvGenerator");
    const { Packer } = await import("docx");
    
    const doc = generateCVDocument(updatedCvData, cv.hasPhoto);
    const blob = await Packer.toBlob(doc);
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Subir el nuevo DOCX a Cloudinary
    const { uploadCVToCloudinary } = await import("@/lib/cloudinary");
    const cloudinaryUrl = await uploadCVToCloudinary(
      buffer,
      session.user.id,
      cv.title
    );

    // Eliminar el CV antiguo de Cloudinary
    const urlParts = cv.url.split('/');
    const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
    if (versionIndex !== -1) {
      const pathAfterVersion = urlParts.slice(versionIndex + 1).join('/');
      try {
        await cloudinary.uploader.destroy(pathAfterVersion, { resource_type: 'raw' });
      } catch (cloudinaryError) {
        console.error("Error al eliminar CV antiguo de Cloudinary:", cloudinaryError);
      }
    }

    // Actualizar en la base de datos
    const { updateCV } = await import("@/lib/mutations");
    await updateCV(cvId, updatedCvData, cloudinaryUrl);

    revalidatePath(`/cvs/${cvId}`);
    revalidatePath("/cvs");

    return { success: true, url: cloudinaryUrl };
  } catch (error) {
    console.error("Error al actualizar CV:", error);
    return { success: false, error: "Error al actualizar el CV" };
  }
}
