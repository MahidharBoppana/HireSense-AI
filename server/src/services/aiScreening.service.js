import AI_WEIGHTS from "../constants/aiWeights.js";

const scoreSkills = (job, candidate) => {
  const requiredSkills = job.requiredSkills.map((skill) =>
    skill.toLowerCase().trim(),
  );

  const candidateSkills = candidate.skills.map((skill) =>
    skill.toLowerCase().trim(),
  );

  const matchedSkills = requiredSkills.filter((skill) =>
    candidateSkills.includes(skill),
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !candidateSkills.includes(skill),
  );

  const score =
    requiredSkills.length === 0
      ? 0
      : (matchedSkills.length / requiredSkills.length) * AI_WEIGHTS.SKILLS;

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

const scoreExperience = (job, candidate) => {
  const candidateExperience = candidate.totalExperience || 0;
  const minimumExperience = job.experience.min;

  let score = 0;

  if (candidateExperience >= minimumExperience) {
    score = AI_WEIGHTS.EXPERIENCE;
  } else {
    score = (candidateExperience / minimumExperience) * AI_WEIGHTS.EXPERIENCE;
  }

  return {
    score: Math.max(0, score),
  };
};

const scoreEducation = (job, candidate) => {
  const preferredEducation = (job.preferredEducation || []).map((degree) =>
    degree.toLowerCase(),
  );

  const candidateDegrees = candidate.education.map((edu) =>
    edu.degree.toLowerCase(),
  );

  const matched = preferredEducation.filter((degree) =>
    candidateDegrees.includes(degree),
  );

  const score =
    preferredEducation.length === 0
      ? AI_WEIGHTS.EDUCATION
      : (matched.length / preferredEducation.length) * AI_WEIGHTS.EDUCATION;

  return {
    score,
  };
};

const scoreProjects = (candidate) => {
  const totalProjects = candidate.projects.length;

  let score = 0;

  if (totalProjects >= 5) score = AI_WEIGHTS.PROJECTS;
  else score = (totalProjects / 5) * AI_WEIGHTS.PROJECTS;

  return {
    score,
  };
};

const scoreCertifications = (candidate) => {
  const totalCertifications = candidate.certifications.length;

  let score = 0;

  if (totalCertifications >= 3) score = AI_WEIGHTS.CERTIFICATIONS;
  else score = (totalCertifications / 3) * AI_WEIGHTS.CERTIFICATIONS;

  return {
    score,
  };
};

const scoreKeywords = (job, candidate) => {
  const keywords = (job.keywords || []).map((keyword) => keyword.toLowerCase());

  const summary = (candidate.summary || "").toLowerCase();

  const matched = keywords.filter((keyword) => summary.includes(keyword));

  const score =
    keywords.length === 0
      ? AI_WEIGHTS.KEYWORDS
      : (matched.length / keywords.length) * AI_WEIGHTS.KEYWORDS;

  return {
    score,
  };
};

const screenCandidate = (job, candidate) => {
  const skills = scoreSkills(job, candidate);
  const experience = scoreExperience(job, candidate);
  const education = scoreEducation(job, candidate);
  const projects = scoreProjects(candidate);
  const certifications = scoreCertifications(candidate);
  const keywords = scoreKeywords(job, candidate);

  const totalScore =
    skills.score +
    experience.score +
    education.score +
    projects.score +
    certifications.score +
    keywords.score;

  let recommendation = "";

  if (totalScore >= 85) {
    recommendation = "Highly Recommended";
  } else if (totalScore >= 70) {
    recommendation = "Recommended";
  } else if (totalScore >= 50) {
    recommendation = "Consider";
  } else {
    recommendation = "Not Suitable";
  }

  const summary = `
Candidate matched ${skills.matchedSkills.length} required skills.
Missing ${skills.missingSkills.length} required skills.
Experience Score: ${experience.score.toFixed(1)}
Education Score: ${education.score.toFixed(1)}
Projects Score: ${projects.score.toFixed(1)}
Certifications Score: ${certifications.score.toFixed(1)}
Overall Score: ${totalScore.toFixed(1)}
Recommendation: ${recommendation}
`;

  return {
    aiScore: Number(totalScore.toFixed(2)),

    matchedSkills: skills.matchedSkills,

    missingSkills: skills.missingSkills,

    recommendation,

    aiSummary: summary,
  };
};

export default screenCandidate;
