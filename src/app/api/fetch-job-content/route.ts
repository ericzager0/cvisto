import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    // Hacer fetch de la página completa
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch job page: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extraer el contenido principal dependiendo del sitio
    let content = "";
    
    // LinkedIn
    if (url.includes("linkedin.com")) {
      content = $(".show-more-less-html__markup, .jobs-description__content, .jobs-box__html-content")
        .text()
        .trim();
    }
    // Bumeran
    else if (url.includes("bumeran.com")) {
      content = $(".job-description, .aviso-description, [data-job-description]")
        .text()
        .trim();
    }
    // Computrabajo
    else if (url.includes("computrabajo.com")) {
      content = $("#job-description, .box_border, .job_text")
        .text()
        .trim();
    }
    // Fallback: intentar obtener el contenido del body
    else {
      content = $("main, article, .content, body")
        .first()
        .text()
        .trim();
    }

    // Limpiar el contenido: eliminar espacios múltiples y líneas vacías
    content = content
      .replace(/\s+/g, " ") // Reemplazar múltiples espacios por uno
      .replace(/\n\s*\n/g, "\n\n") // Limpiar líneas vacías múltiples
      .trim();

    // Extraer también información estructurada
    const title = $("h1, .job-title, .aviso-title").first().text().trim();
    const company = $(".job-company, .company-name, .aviso-empresa").first().text().trim();
    const location = $(".job-location, .aviso-location, .location").first().text().trim();
    const salary = $(".salary, .aviso-salary, .job-salary").first().text().trim();

    // Construir el contenido completo estructurado
    let fullContent = "";
    if (title) fullContent += `${title}\n\n`;
    if (company) fullContent += `Empresa: ${company}\n`;
    if (location) fullContent += `Ubicación: ${location}\n`;
    if (salary) fullContent += `Salario: ${salary}\n`;
    fullContent += "\n" + content;

    return NextResponse.json({ 
      content: fullContent,
      metadata: {
        title,
        company,
        location,
        salary,
        url
      }
    });
  } catch (error) {
    console.error("Error fetching job content:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch job content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
