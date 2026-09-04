const extractEmail = (text) => {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);

  return match ? match[0] : "";
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?(\d{10})/);

  return match ? match[0] : "";
};

const extractGithub = (text) => {
  const match = text.match(/https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_-]+/i);

  return match ? match[0] : "";
};

const extractLinkedIn = (text) => {
  const match = text.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i,
  );

  return match ? match[0] : "";
};

const extractPortfolio = (text) => {
  const urls = text.match(/https?:\/\/[^\s]+/gi) || [];

  const portfolio = urls.find(
    (url) =>
      !url.toLowerCase().includes("github.com") &&
      !url.toLowerCase().includes("linkedin.com"),
  );

  return portfolio || "";
};

/* =========================================================
   CLEAN PDF TEXT
========================================================= */

const cleanText = (text) => {
  return text
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
};

/* =========================================================
   NAME
========================================================= */

const extractName = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines[0] : "";
};

/* =========================================================
   SKILLS
========================================================= */

const extractSkills = (text) => {
  const skillMap = [
    ["JavaScript", /\bjavascript\b/i],
    ["Java", /\bjava\b/i],
    ["TypeScript", /\btypescript\b/i],

    ["React", /\breact(?:\.js)?\b/i],
    ["Next.js", /\bnext\.js\b/i],

    ["Node.js", /\bnode\.js\b/i],
    ["Express.js", /\bexpress(?:\.js)?\b/i],

    ["MongoDB", /\bmongodb\b/i],
    ["MySQL", /\bmysql\b/i],
    ["PostgreSQL", /\bpostgresql\b/i],

    ["Redis", /\bredis\b/i],

    ["Docker", /\bdocker\b/i],
    ["Kubernetes", /\bkubernetes\b/i],

    ["AWS", /\baws\b/i],
    ["Azure", /\bazure\b/i],
    ["GCP", /\bgcp\b/i],

    ["Python", /\bpython\b/i],
    ["C++", /\bc\+\+\b/i],

    ["HTML5", /\bhtml5\b/i],
    ["CSS3", /\bcss3\b/i],

    ["TailwindCSS", /\btailwind\s*css\b/i],
    ["Bootstrap", /\bbootstrap\b/i],

    ["Git", /\bgit\b/i],
    ["GitHub", /\bgithub\b/i],

    ["REST API", /\brest\s*api(?:s)?\b/i],
    ["GraphQL", /\bgraphql\b/i],

    ["Redux", /\bredux\b/i],
    ["Mongoose", /\bmongoose\b/i],
    ["JWT", /\bjwt\b/i],

    ["Firebase", /\bfirebase\b/i],
  ];

  return skillMap
    .filter(([, regex]) => regex.test(text))
    .map(([skill]) => skill);
};

/* =========================================================
   SECTION EXTRACTION
========================================================= */

const extractSection = (text, startHeading, endHeadings) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const startIndex = lines.findIndex(
    (line) => line.toLowerCase() === startHeading.toLowerCase(),
  );

  if (startIndex === -1) {
    return [];
  }

  const section = [];

  for (let i = startIndex + 1; i < lines.length; i++) {
    const currentLine = lines[i];

    const isEndHeading = endHeadings.some(
      (heading) => currentLine.toLowerCase() === heading.toLowerCase(),
    );

    if (isEndHeading) {
      break;
    }

    section.push(currentLine);
  }

  return section;
};

/* =========================================================
   SUMMARY
========================================================= */

const extractSummary = (text) => {
  const lines = extractSection(text, "Professional Summary", [
    "Education",
    "Experience",
    "Work Experience",
    "Projects",
    "Technical Skills",
    "Certifications & Achievements",
    "Certifications",
  ]);

  return lines.join(" ").trim();
};

/* =========================================================
   DATE HELPERS
========================================================= */

const createDate = (year) => {
  if (!year) return null;

  return `${year}-01-01`;
};

const extractYearRange = (text) => {
  const match = text.match(
    /\b(19\d{2}|20\d{2})\s*(?:[-–—]|to)\s*(19\d{2}|20\d{2})\b/i,
  );

  if (!match) {
    const singleYear = text.match(/\b(19\d{2}|20\d{2})\b/);

    return {
      startDate: singleYear ? createDate(singleYear[1]) : null,
      endDate: null,
    };
  }

  return {
    startDate: createDate(match[1]),
    endDate: createDate(match[2]),
  };
};

const extractFieldOfStudy = (degree) => {
  const normalized = degree.toLowerCase();

  if (normalized.includes("computer application")) {
    return "Computer Application";
  }

  if (normalized.includes("computer science")) {
    return "Computer Science";
  }

  if (normalized.includes("information technology")) {
    return "Information Technology";
  }

  const fieldMatch = degree.match(/(?:in|major in|specialization in)\s+(.+)$/i);

  return fieldMatch ? fieldMatch[1].trim() : "";
};

/* =========================================================
   EDUCATION
========================================================= */

const extractEducation = (text) => {
  const lines = extractSection(text, "Education", [
    "Experience",
    "Work Experience",
    "Projects",
    "Technical Skills",
    "Certifications & Achievements",
    "Certifications",
  ]);

  const education = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i].trim();

    const isInstitution = /University|College|School/i.test(currentLine);

    if (!isInstitution) {
      continue;
    }

    // Extract dates from institution line
    const dates = extractYearRange(currentLine);

    // Institution name
    const institution = currentLine
      .replace(/\s*\d{4}\s*[–-]\s*\d{4}/, "")
      .replace(/\s*\d{4}\s*$/, "")
      .trim();

    // Degree is normally the next line
    const degreeLine = lines[i + 1] || "";

    let degree = degreeLine
      .replace(/\s*[–-]\s*CGPA:\s*[\d.]+/i, "")
      .replace(/\s*[–-]\s*[\d.]+%/i, "")
      .replace(/\s+(Vadodara|Gujarat|Nallajerla|Andhra Pradesh).*$/i, "")
      .trim();

    // Extract field of study
    let fieldOfStudy = extractFieldOfStudy(degree);

    // If date is not on institution line,
    // check nearby lines
    let startDate = dates.startDate;
    let endDate = dates.endDate;

    if (!startDate && !endDate) {
      for (
        let j = Math.max(0, i - 1);
        j <= Math.min(lines.length - 1, i + 2);
        j++
      ) {
        const nearbyDates = extractYearRange(lines[j]);

        if (nearbyDates.startDate || nearbyDates.endDate) {
          startDate = nearbyDates.startDate;
          endDate = nearbyDates.endDate;
          break;
        }
      }
    }

    // If still no date, try a single year
    if (!startDate && !endDate) {
      const yearMatch = currentLine.match(/\b(19\d{2}|20\d{2})\b/);

      if (yearMatch) {
        startDate = createDate(yearMatch[1]);
      }
    }

    education.push({
      degree,
      institution,
      fieldOfStudy,
      startDate,
      endDate,
    });
  }

  return education;
};

/* =========================================================
   EXPERIENCE
========================================================= */

const extractExperience = (text) => {
  const lines = extractSection(text, "Experience", [
    "Projects",
    "Technical Skills",
    "Certifications & Achievements",
    "Certifications",
  ]);

  if (!lines.length) {
    return [];
  }

  /*
    We are intentionally keeping this empty for now.

    Experience formats vary heavily between resumes.
    We will implement a stronger experience parser later
    or use AI extraction.
  */

  return [];
};

/* =========================================================
   PROJECT TECHNOLOGIES
========================================================= */

const cleanProjectTechnologies = (technologyText) => {
  return technologyText
    .replace(/\bGitHub\b/gi, "")
    .replace(/\bLive Demo\b/gi, "")
    .replace(/\s+/g, " ")
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);
};

/* =========================================================
   PROJECTS
========================================================= */

const extractProjects = (text, allLinks = []) => {
  const lines = extractSection(text, "Projects", [
    "Technical Skills",
    "Experience",
    "Work Experience",
    "Certifications & Achievements",
    "Certifications",
  ]);

  // NEW: Categorize project-specific URLs
  const githubRepoUrls = allLinks.filter((url) => {
    const lower = url.toLowerCase();
    if (!lower.includes("github.com")) return false;
    try {
      const pathParts = new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).pathname
        .split("/")
        .filter(Boolean);
      return pathParts.length >= 2; // Repository URL: github.com/user/repo
    } catch {
      return false;
    }
  });

  const liveUrls = allLinks.filter((url) => {
    const lower = url.toLowerCase();
    return (
      !lower.includes("github.com") &&
      !lower.includes("linkedin.com") &&
      !lower.startsWith("mailto:")
    );
  });

  const projects = [];

  let currentProject = null;

  for (const line of lines) {
    /*
      Project heading:

      NoteFlow | React.js, Node.js, Express.js, MongoDB, JWT GitHub | Live Demo
    */

    if (line.includes("|")) {
      if (currentProject) {
        projects.push(currentProject);
      }

      const parts = line.split("|");

      const title = parts[0].trim();

      const technologyText = parts[1] || "";

      currentProject = {
        title,
        description: "",
        technologies: cleanProjectTechnologies(technologyText),
        github: "",
        live: "",
      };

      continue;
    }

    if (currentProject && line.startsWith("•")) {
      const bullet = line.replace(/^•\s*/, "").trim();

      currentProject.description +=
        (currentProject.description ? " " : "") + bullet;
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  // NEW: Match and attach GitHub and Live links to parsed projects
  return projects.map((project) => {
    const titleSlug = project.title.toLowerCase().replace(/[^a-z0-9]/g, "");

    const matchedGithub = githubRepoUrls.find((url) => {
      const cleanUrl = url.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanUrl.includes(titleSlug) || titleSlug.includes(cleanUrl);
    });

    const matchedLive = liveUrls.find((url) => {
      const cleanUrl = url.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cleanUrl.includes(titleSlug) || titleSlug.includes(cleanUrl);
    });

    return {
      ...project,
      github: matchedGithub || githubRepoUrls.shift() || "",
      live: matchedLive || liveUrls.shift() || "",
    };
  });
};

/* =========================================================
   CERTIFICATIONS + ACHIEVEMENTS
========================================================= */

const extractCertificationAndAchievements = (text) => {
  const lines = extractSection(text, "Certifications & Achievements", []);

  const cleanedLines = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^--\s*\d+\s*of\s*\d+\s*--$/i.test(line))
    .map((line) => line.replace(/^•\s*/, "").trim());

  const certifications = [];
  const achievements = [];

  cleanedLines.forEach((line, index) => {
    /*
      Current resume format:

      JavaScript Fundamentals – Scaler Topics
      Solved DSA...
      Built multiple...
    */

    if (index === 0 && line) {
      const parts = line.split(/\s+[–-]\s+/);

      certifications.push({
        name: parts[0]?.trim() || line,
        organization: parts[1]?.trim() || "",
        issueDate: null,
      });

      return;
    }

    achievements.push(line);
  });

  return {
    certifications,
    achievements,
  };
};

/* =========================================================
   LANGUAGES
========================================================= */

const extractLanguages = (text) => {
  const lines = extractSection(text, "Languages", [
    "Certifications",
    "Certifications & Achievements",
    "Projects",
    "Technical Skills",
  ]);

  return lines;
};

/* =========================================================
   TOTAL EXPERIENCE
========================================================= */

const calculateTotalExperience = (experience) => {
  if (!experience.length) {
    return 0;
  }

  let totalMonths = 0;

  experience.forEach((job) => {
    if (!job.startDate) {
      return;
    }

    const start = new Date(job.startDate);

    const end = job.currentlyWorking
      ? new Date()
      : job.endDate
        ? new Date(job.endDate)
        : null;

    if (!end) {
      return;
    }

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());

    totalMonths += Math.max(months, 0);
  });

  return Number((totalMonths / 12).toFixed(1));
};

/* =========================================================
   MAIN PARSER
========================================================= */

const parseResume = (text, links = {}) => {
  const cleanedText = cleanText(text);

  const experience = extractExperience(cleanedText);

  const { certifications, achievements } =
    extractCertificationAndAchievements(cleanedText);

  return {
    fullName: extractName(cleanedText),

    email: extractEmail(cleanedText),

    phone: extractPhone(cleanedText),

    github: links.github || extractGithub(cleanedText),

    linkedin: links.linkedin || extractLinkedIn(cleanedText),

    portfolio: links.portfolio || extractPortfolio(cleanedText),

    skills: extractSkills(cleanedText),

    summary: extractSummary(cleanedText),

    education: extractEducation(cleanedText),

    experience,

    // UPDATED: Pass links.allLinks to extractProjects
    projects: extractProjects(cleanedText, links.allLinks || []),

    certifications,

    achievements,

    languages: extractLanguages(cleanedText),

    totalExperience: calculateTotalExperience(experience),
  };
};

export default parseResume;
