const extractEmail = (text) => {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
};

const extractPhone = (text) => {
  const match = text.match(/(\+?\d{1,3}[-.\s]?)?(\d{10})/);

  return match ? match[0] : "";
};

const extractGithub = (text) => {
  const match = text.match(
    /(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+/i,
  );

  return match ? match[0] : "";
};

const extractLinkedIn = (text) => {
  const match = text.match(
    /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i,
  );

  return match ? match[0] : "";
};

const extractPortfolio = (text) => {
  const match = text.match(/(https?:\/\/)(?!.*(github|linkedin))[^\s]+/i);

  return match ? match[0] : "";
};

const extractName = (text) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length ? lines[0] : "";
};

const extractSkills = (text) => {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Java",
    "Python",
    "C++",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "Bootstrap",
    "Git",
    "GitHub",
    "REST API",
    "GraphQL",
    "Redux",
    "Mongoose",
    "JWT",
    "Firebase",
  ];

  return skills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase()),
  );
};

const parseResume = (text) => {
  return {
    fullName: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    github: extractGithub(text),
    linkedin: extractLinkedIn(text),
    portfolio: extractPortfolio(text),
    skills: extractSkills(text),
    summary: "",
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    totalExperience: 0,
  };
};

export default parseResume;
