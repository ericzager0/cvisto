import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  UnderlineType,
  convertInchesToTwip,
  TabStopType,
  TabStopPosition,
  LevelFormat,
} from "docx";

interface CVData {
  header: {
    name: string;
    address: string;
    phone: string;
    email: string;
    links: Array<{ label: string; url: string }>;
  };
  education: Array<{
    university_name: string;
    city_state_country: string;
    degree: string;
    major: string | null;
    expected_graduation: string;
    gpa: string | null;
    honors: string[];
    relevant_coursework: string[];
  }>;
  experiences: Array<{
    company_name: string;
    city_state_country: string;
    position_title: string;
    group_name: string | null;
    start_date: string;
    end_date: string;
    summary_sentence: string;
    selected_experiences: Array<{
      project_name: string;
      bullets: string[];
    }>;
  }>;
  projects_independent: Array<{
    project_name: string;
    stack: string[];
    link: string | null;
    bullets: string[];
  }>;
  skills: {
    languages_spoken: Array<{ name: string; level: string }>;
    programming_languages: string[];
    frameworks_tools: string[];
    databases: string[];
    devops_cloud: string[];
    methodologies: string[];
  };
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    id_or_url: string | null;
  }>;
  awards: Array<{
    title: string;
    issuer: string;
    year: string;
    description: string;
  }>;
  publications: Array<{
    title: string;
    venue: string;
    year: string;
    url: string;
  }>;
  volunteering: Array<{
    organization: string;
    role: string;
    start_date: string;
    end_date: string;
    bullets: string[];
  }>;
  interests: string[];
}

export function generateCVDocument(
  data: CVData,
  includePhoto: boolean = false
): Document {
  const sections: Paragraph[] = [];

  // ========== HEADER ==========
  sections.push(
    new Paragraph({
      text: data.header.name || "[COMPLETAR MANUALMENTE]",
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      style: "Heading1",
    })
  );

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: data.header.address || "[Physical Address]",
        }),
      ],
    })
  );

  const contactInfo = [];
  if (data.header.phone) contactInfo.push(data.header.phone);
  if (data.header.email) contactInfo.push(data.header.email);
  const linkTexts = data.header.links.map((l) => l.url);
  contactInfo.push(...linkTexts);

  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: contactInfo.join(" | "),
        }),
      ],
    })
  );

  // ========== EDUCATION ==========
  sections.push(
    new Paragraph({
      text: "EDUCACIÓN",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      thematicBreak: true,
    })
  );

  data.education.forEach((edu) => {
    // University name and location on same line
    sections.push(
      new Paragraph({
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: edu.university_name || "[COMPLETAR MANUALMENTE]",
            bold: true,
          }),
          new TextRun({
            text: `\t${edu.city_state_country || "[City], [State/Country]"}`,
          }),
        ],
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
      })
    );

    // Determinar si es "Expected" o ya se graduó
    let graduationPrefix = "Esperado ";
    if (edu.expected_graduation) {
      // Intentar parsear la fecha
      const dateStr = edu.expected_graduation;
      const today = new Date();

      // Intentar diferentes formatos de fecha
      let graduationDate: Date | null = null;

      // Formato "Mes AAAA" o "MMM AAAA"
      const monthYearMatch = dateStr.match(/^([A-Za-z]+)\s+(\d{4})$/);
      if (monthYearMatch) {
        const monthNames: { [key: string]: number } = {
          ene: 0,
          enero: 0,
          jan: 0,
          january: 0,
          feb: 1,
          febrero: 1,
          february: 1,
          mar: 2,
          marzo: 2,
          march: 2,
          abr: 3,
          abril: 3,
          apr: 3,
          april: 3,
          may: 4,
          mayo: 4,
          jun: 5,
          junio: 5,
          june: 5,
          jul: 6,
          julio: 6,
          july: 6,
          ago: 7,
          agosto: 7,
          aug: 7,
          august: 7,
          sep: 8,
          septiembre: 8,
          september: 8,
          oct: 9,
          octubre: 9,
          october: 9,
          nov: 10,
          noviembre: 10,
          november: 10,
          dic: 11,
          diciembre: 11,
          dec: 11,
          december: 11,
        };
        const monthStr = monthYearMatch[1].toLowerCase();
        const year = parseInt(monthYearMatch[2]);
        const month = monthNames[monthStr];
        if (month !== undefined) {
          graduationDate = new Date(year, month, 1);
        }
      }

      // Formato "MM/AAAA"
      const mmYYYYMatch = dateStr.match(/^(\d{2})\/(\d{4})$/);
      if (mmYYYYMatch) {
        const month = parseInt(mmYYYYMatch[1]) - 1;
        const year = parseInt(mmYYYYMatch[2]);
        graduationDate = new Date(year, month, 1);
      }

      // Si logramos parsear la fecha, verificar si ya pasó
      if (graduationDate && graduationDate <= today) {
        graduationPrefix = "Graduado ";
      }
    }

    // Degree and expected/graduated date
    sections.push(
      new Paragraph({
        spacing: { after: 50 },
        children: [
          new TextRun({
            text: edu.major
              ? `${edu.degree} in ${edu.major}`
              : edu.degree || "[COMPLETAR MANUALMENTE]",
            italics: true,
          }),
          new TextRun({
            text: `\t${graduationPrefix}${
              edu.expected_graduation || "[Graduation Date]"
            }`,
          }),
        ],
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
      })
    );

    // GPA if exists
    if (edu.gpa) {
      sections.push(
        new Paragraph({
          text: `• GPA: ${edu.gpa}`,
          spacing: { after: 50 },
          bullet: { level: 0 },
        })
      );
    }

    // Honors if exist
    if (edu.honors && edu.honors.length > 0) {
      sections.push(
        new Paragraph({
          text: `• Honors: ${edu.honors.join(", ")}`,
          spacing: { after: 50 },
          bullet: { level: 0 },
        })
      );
    }

    // Relevant Coursework if exists
    if (edu.relevant_coursework && edu.relevant_coursework.length > 0) {
      sections.push(
        new Paragraph({
          text: `• Relevant Coursework: ${edu.relevant_coursework.join(", ")}`,
          spacing: { after: 100 },
          bullet: { level: 0 },
        })
      );
    }
  });

  // ========== WORK & LEADERSHIP EXPERIENCE ==========
  if (data.experiences && data.experiences.length > 0) {
    sections.push(
      new Paragraph({
        text: "EXPERIENCIA LABORAL Y LIDERAZGO",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        thematicBreak: true,
      })
    );

    data.experiences.forEach((exp) => {
      // Company name and location
      sections.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({
              text: exp.company_name || "[COMPLETAR MANUALMENTE]",
              bold: true,
            }),
            new TextRun({
              text: `\t${exp.city_state_country || "[City], [State/Country]"}`,
            }),
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
        })
      );

      // Position title, group name and dates
      const groupInfo = exp.group_name ? `, ${exp.group_name}` : "";
      sections.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({
              text: `${exp.position_title || "[Position Title]"}${groupInfo}`,
              italics: true,
            }),
            new TextRun({
              text: `\t${exp.start_date || "[Start Date]"} – ${
                exp.end_date || "[End Date]"
              }`,
            }),
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
        })
      );

      // Summary sentence
      if (exp.summary_sentence) {
        sections.push(
          new Paragraph({
            text: `• ${exp.summary_sentence}`,
            spacing: { after: 50 },
            bullet: { level: 0 },
          })
        );
      }

      // Selected experiences (projects)
      exp.selected_experiences.forEach((project) => {
        sections.push(
          new Paragraph({
            text: `Experiencia seleccionada en ${project.project_name}:`,
            spacing: { after: 50 },
            bullet: { level: 0 },
          })
        );

        project.bullets.forEach((bullet) => {
          sections.push(
            new Paragraph({
              text: bullet,
              spacing: { after: 50 },
              bullet: { level: 1 },
            })
          );
        });
      });

      sections.push(
        new Paragraph({
          text: "",
          spacing: { after: 100 },
        })
      );
    });
  }

  // ========== PROJECTS (Independent) ==========
  if (data.projects_independent && data.projects_independent.length > 0) {
    sections.push(
      new Paragraph({
        text: "PROYECTOS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
        thematicBreak: true,
      })
    );

    data.projects_independent.forEach((project) => {
      const stackText =
        project.stack.length > 0 ? ` (${project.stack.join(", ")})` : "";

      sections.push(
        new Paragraph({
          spacing: { after: 50 },
          children: [
            new TextRun({
              text: project.project_name || "[COMPLETAR MANUALMENTE]",
              bold: true,
            }),
            new TextRun({
              text: stackText,
            }),
          ],
        })
      );

      if (project.link) {
        sections.push(
          new Paragraph({
            text: `Enlace: ${project.link}`,
            spacing: { after: 50 },
            bullet: { level: 0 },
          })
        );
      }

      project.bullets.forEach((bullet) => {
        sections.push(
          new Paragraph({
            text: bullet,
            spacing: { after: 50 },
            bullet: { level: 0 },
          })
        );
      });

      sections.push(
        new Paragraph({
          text: "",
          spacing: { after: 100 },
        })
      );
    });
  }

  // ========== SKILLS, ACTIVITIES & INTERESTS ==========
  sections.push(
    new Paragraph({
      text: "HABILIDADES, ACTIVIDADES E INTERESES",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 100 },
      thematicBreak: true,
    })
  );

  // Languages
  if (data.skills.languages_spoken && data.skills.languages_spoken.length > 0) {
    const langText = data.skills.languages_spoken
      .map((l) => `${l.level} en ${l.name}`)
      .join("; ");
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Idiomas: ",
            bold: true,
          }),
          new TextRun({
            text: langText,
          }),
        ],
      })
    );
  }

  // Technical Skills (Programming Languages)
  if (
    data.skills.programming_languages &&
    data.skills.programming_languages.length > 0
  ) {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Habilidades Técnicas: ",
            bold: true,
          }),
          new TextRun({
            text: data.skills.programming_languages.join(", "),
          }),
        ],
      })
    );
  }

  // Frameworks & Tools
  if (data.skills.frameworks_tools && data.skills.frameworks_tools.length > 0) {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Frameworks y Herramientas: ",
            bold: true,
          }),
          new TextRun({
            text: data.skills.frameworks_tools.join(", "),
          }),
        ],
      })
    );
  }

  // Databases
  if (data.skills.databases && data.skills.databases.length > 0) {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Bases de Datos: ",
            bold: true,
          }),
          new TextRun({
            text: data.skills.databases.join(", "),
          }),
        ],
      })
    );
  }

  // DevOps & Cloud
  if (data.skills.devops_cloud && data.skills.devops_cloud.length > 0) {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "DevOps y Cloud: ",
            bold: true,
          }),
          new TextRun({
            text: data.skills.devops_cloud.join(", "),
          }),
        ],
      })
    );
  }

  // Methodologies
  if (data.skills.methodologies && data.skills.methodologies.length > 0) {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Metodologías: ",
            bold: true,
          }),
          new TextRun({
            text: data.skills.methodologies.join(", "),
          }),
        ],
      })
    );
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    const certText = data.certifications
      .map((c) => `${c.name} (${c.issuer}, ${c.year})`)
      .join("; ");
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Certificaciones y Capacitaciones: ",
            bold: true,
          }),
          new TextRun({
            text: certText,
          }),
        ],
      })
    );
  }

  // Awards
  if (data.awards && data.awards.length > 0) {
    const awardsText = data.awards
      .map((a) => `${a.title} (${a.issuer}, ${a.year})`)
      .join("; ");
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Premios: ",
            bold: true,
          }),
          new TextRun({
            text: awardsText,
          }),
        ],
      })
    );
  }

  // Volunteering/Activities
  if (data.volunteering && data.volunteering.length > 0) {
    const volText = data.volunteering
      .map(
        (v) =>
          `${v.role} en ${v.organization} (${v.start_date} - ${v.end_date})`
      )
      .join("; ");
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Actividades: ",
            bold: true,
          }),
          new TextRun({
            text: volText,
          }),
        ],
      })
    );
  }

  // Interests
  if (data.interests && data.interests.length > 0) {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: "Intereses: ",
            bold: true,
          }),
          new TextRun({
            text: data.interests.join(", "),
          }),
        ],
      })
    );
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.5),
            },
          },
        },
        children: sections,
      },
    ],
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: {
            size: 32,
            bold: true,
          },
          paragraph: {
            spacing: {
              after: 120,
            },
          },
        },
      ],
    },
  });

  return doc;
}
