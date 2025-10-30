import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  postedDate: string;
  salary?: string;
  jobType?: string;
}

async function scrapeLinkedInJobs(
  query: string,
  location: string
): Promise<ScrapedJob[]> {
  try {
    // Construir URL de LinkedIn Jobs
    const searchQuery = encodeURIComponent(query);
    const searchLocation = encodeURIComponent(location || "Argentina");
    const url = `https://www.linkedin.com/jobs/search?keywords=${searchQuery}&location=${searchLocation}&f_TPR=r86400&position=1&pageNum=0`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "max-age=0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Buscar las tarjetas de trabajo en LinkedIn
    $("li").each((index, element) => {
      const $element = $(element);

      // Verificar si es una tarjeta de trabajo válida
      const jobCard = $element.find(".base-card");
      if (jobCard.length === 0) return;

      // Extraer información
      const title = jobCard.find(".base-search-card__title").text().trim();
      const company = jobCard
        .find(".base-search-card__subtitle")
        .text()
        .trim();
      const location = jobCard.find(".job-search-card__location").text().trim();
      const url = jobCard.find("a.base-card__full-link").attr("href") || "";
      const postedDate = jobCard.find("time").attr("datetime") || "";

      // Extraer ID del trabajo de la URL
      const jobIdMatch = url.match(/jobs\/view\/(\d+)/);
      const id = jobIdMatch ? jobIdMatch[1] : `job-${index}`;

      if (title && company && url) {
        jobs.push({
          id,
          title,
          company,
          location: location || "No especificada",
          description: "", // LinkedIn no muestra descripción en listados
          url,
          postedDate: postedDate || new Date().toISOString(),
          jobType: "No especificado",
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error scraping LinkedIn:", error);
    throw error;
  }
}

async function scrapeBumeranJobs(
  query: string,
  location: string
): Promise<ScrapedJob[]> {
  try {
    // Construir URL de Bumeran
    const searchQuery = encodeURIComponent(query);
    const url = `https://www.bumeran.com.ar/empleos-busqueda-${searchQuery}.html`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-AR,es;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Buscar las tarjetas de trabajo en Bumeran
    $("article[data-aviso-id]").each((index, element) => {
      const $element = $(element);

      const id = $element.attr("data-aviso-id") || `job-${index}`;
      const title = $element.find("h2").text().trim();
      const company = $element.find(".company-name").text().trim();
      const location = $element.find(".job-location").text().trim();
      const description = $element.find(".job-description").text().trim();
      const relativeUrl = $element.find("a").attr("href") || "";
      const url = relativeUrl.startsWith("http")
        ? relativeUrl
        : `https://www.bumeran.com.ar${relativeUrl}`;
      const postedDate = $element.find(".posted-date").text().trim();
      const salary = $element.find(".salary").text().trim();

      if (title && url) {
        jobs.push({
          id,
          title,
          company: company || "Empresa confidencial",
          location: location || "Buenos Aires, Argentina",
          description: description || "",
          url,
          postedDate: postedDate || new Date().toISOString(),
          salary: salary || undefined,
          jobType: "No especificado",
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error scraping Bumeran:", error);
    throw error;
  }
}

async function scrapeComputrabajoJobs(
  query: string,
  location: string
): Promise<ScrapedJob[]> {
  try {
    // Construir URL de Computrabajo
    const searchQuery = encodeURIComponent(query);
    const url = `https://www.computrabajo.com.ar/trabajo-de-${searchQuery}`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es-AR,es;q=0.9",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const jobs: ScrapedJob[] = [];

    // Buscar las tarjetas de trabajo en Computrabajo
    $("article[data-id]").each((index, element) => {
      const $element = $(element);

      const id = $element.attr("data-id") || `job-${index}`;
      const title = $element.find("h2 a").text().trim();
      const company = $element.find(".fs16").first().text().trim();
      const location = $element.find(".fs13").first().text().trim();
      const description = $element.find("p").text().trim();
      const relativeUrl = $element.find("h2 a").attr("href") || "";
      const url = relativeUrl.startsWith("http")
        ? relativeUrl
        : `https://www.computrabajo.com.ar${relativeUrl}`;
      const postedDate = $element.find("time").text().trim();

      if (title && url) {
        jobs.push({
          id,
          title,
          company: company || "Empresa confidencial",
          location: location || "Buenos Aires, Argentina",
          description: description || "",
          url,
          postedDate: postedDate || new Date().toISOString(),
          jobType: "No especificado",
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error scraping Computrabajo:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const location = searchParams.get("location") || "Argentina";
    const source = searchParams.get("source") || "all"; // all, linkedin, bumeran, computrabajo

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    let allJobs: ScrapedJob[] = [];

    // Scrape de múltiples fuentes en paralelo
    const promises: Promise<ScrapedJob[]>[] = [];

    if (source === "all" || source === "linkedin") {
      promises.push(
        scrapeLinkedInJobs(query, location).catch((err) => {
          console.error("LinkedIn scraping failed:", err);
          return [];
        })
      );
    }

    if (source === "all" || source === "bumeran") {
      promises.push(
        scrapeBumeranJobs(query, location).catch((err) => {
          console.error("Bumeran scraping failed:", err);
          return [];
        })
      );
    }

    if (source === "all" || source === "computrabajo") {
      promises.push(
        scrapeComputrabajoJobs(query, location).catch((err) => {
          console.error("Computrabajo scraping failed:", err);
          return [];
        })
      );
    }

    const results = await Promise.all(promises);
    allJobs = results.flat();

    // Eliminar duplicados basados en título y empresa
    const uniqueJobs = allJobs.filter(
      (job, index, self) =>
        index ===
        self.findIndex(
          (j) =>
            j.title.toLowerCase() === job.title.toLowerCase() &&
            j.company.toLowerCase() === job.company.toLowerCase()
        )
    );

    // Ordenar por fecha (más recientes primero)
    uniqueJobs.sort((a, b) => {
      const dateA = new Date(a.postedDate).getTime();
      const dateB = new Date(b.postedDate).getTime();
      return dateB - dateA;
    });

    return NextResponse.json({
      jobs: uniqueJobs,
      total: uniqueJobs.length,
      sources: {
        linkedin: results[0]?.length || 0,
        bumeran: results[1]?.length || 0,
        computrabajo: results[2]?.length || 0,
      },
    });
  } catch (error) {
    console.error("Error in scraping API:", error);
    return NextResponse.json(
      {
        error: "Failed to scrape jobs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
