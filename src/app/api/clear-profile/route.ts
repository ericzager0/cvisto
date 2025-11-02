import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    console.log("=== INICIANDO LIMPIEZA DE PERFIL ===");
    console.log("User ID:", userId);

    if (!userId) {
      console.error("Error: Falta userId");
      return NextResponse.json(
        { error: "Missing userId", details: "userId es requerido" },
        { status: 400 }
      );
    }

    // Limpiar campos del perfil (manteniendo nombre, email y foto)
    console.log("Limpiando campos del perfil...");
    await sql`
      UPDATE users
      SET bio = NULL,
          phone_number = NULL,
          location = NULL,
          recommended_positions = NULL,
          profile_enhancement = NULL
      WHERE id = ${userId}
    `;
    console.log("Campos del perfil limpiados");

    // Eliminar experiencias
    console.log("Eliminando experiencias...");
    const expResult = await sql`
      DELETE FROM experiences
      WHERE user_id = ${userId}
      RETURNING id
    `;
    console.log(`Eliminadas ${expResult.length} experiencias`);

    // Eliminar educaciones
    console.log("Eliminando educaciones...");
    const eduResult = await sql`
      DELETE FROM educations
      WHERE user_id = ${userId}
      RETURNING id
    `;
    console.log(`Eliminadas ${eduResult.length} educaciones`);

    // Eliminar habilidades
    console.log("Eliminando habilidades...");
    const skillResult = await sql`
      DELETE FROM skills
      WHERE user_id = ${userId}
      RETURNING id
    `;
    console.log(`Eliminadas ${skillResult.length} habilidades`);

    // Eliminar proyectos
    console.log("Eliminando proyectos...");
    const projResult = await sql`
      DELETE FROM projects
      WHERE user_id = ${userId}
      RETURNING id
    `;
    console.log(`Eliminados ${projResult.length} proyectos`);

    // Eliminar idiomas
    console.log("Eliminando idiomas...");
    const langResult = await sql`
      DELETE FROM languages
      WHERE user_id = ${userId}
      RETURNING id
    `;
    console.log(`Eliminados ${langResult.length} idiomas`);

    // Eliminar links
    console.log("Eliminando links...");
    const linkResult = await sql`
      DELETE FROM links
      WHERE user_id = ${userId}
      RETURNING id
    `;
    console.log(`Eliminados ${linkResult.length} links`);

    console.log("=== PERFIL LIMPIADO EXITOSAMENTE ===");
    return NextResponse.json({
      success: true,
      message: "Perfil limpiado exitosamente",
      deleted: {
        experiences: expResult.length,
        educations: eduResult.length,
        skills: skillResult.length,
        projects: projResult.length,
        languages: langResult.length,
        links: linkResult.length,
      },
    });
  } catch (error) {
    console.error("=== ERROR EN LIMPIEZA DE PERFIL ===");
    console.error("Error completo:", error);
    console.error("Tipo de error:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Mensaje:", error instanceof Error ? error.message : "Unknown error");
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");

    return NextResponse.json(
      {
        error: "Failed to clear profile",
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : "Unknown",
      },
      { status: 500 }
    );
  }
}
