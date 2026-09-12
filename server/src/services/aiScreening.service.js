import AI_WEIGHTS from "../constants/aiWeights.js";
import analyzeCandidateWithGroq from "./groq.service.js";

const scoreSkills = (job, candidate) => {
  const requiredSkills = (job.requiredSkills || []).map((skill) =>
    skill.toLowerCase().trim(),
  );

  const candidateSkills = (candidate.skills || []).map((skill) =>
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
      ? AI_WEIGHTS.SKILLS
      : (matchedSkills.length / requiredSkills.length) * AI_WEIGHTS.SKILLS;

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

const scoreExperience = (job, candidate) => {
  const candidateExperience = candidate.totalExperience || 0;
  const minimumExperience = job.experience?.min || 0;
  const maximumExperience = job.experience?.max;

  let score = 0;

  if (minimumExperience === 0) {
    score = AI_WEIGHTS.EXPERIENCE;
  } else if (candidateExperience >= minimumExperience) {
    score = AI_WEIGHTS.EXPERIENCE;
  } else {
    score = (candidateExperience / minimumExperience) * AI_WEIGHTS.EXPERIENCE;
  }

  return {
    score: Math.max(0, Math.min(AI_WEIGHTS.EXPERIENCE, score)),
    candidateExperience,
    minimumExperience,
    maximumExperience,
  };
};

const scoreEducation = (job, candidate) => {
  const preferredEducation = (job.preferredEducation || []).map((degree) =>
    degree.toLowerCase().trim(),
  );

  const candidateDegrees = (candidate.education || [])
    .map((edu) => edu.degree)
    .filter(Boolean)
    .map((degree) => degree.toLowerCase().trim());

  const matched = preferredEducation.filter((degree) =>
    candidateDegrees.includes(degree),
  );

  const score =
    preferredEducation.length === 0
      ? AI_WEIGHTS.EDUCATION
      : (matched.length / preferredEducation.length) * AI_WEIGHTS.EDUCATION;

  return {
    score,
    matchedEducation: matched,
  };
};

const scoreProjects = (candidate) => {
  const totalProjects = (candidate.projects || []).length;

  let score = 0;

  if (totalProjects >= 5) {
    score = AI_WEIGHTS.PROJECTS;
  } else {
    score = (totalProjects / 5) * AI_WEIGHTS.PROJECTS;
  }

  return {
    score: Math.max(0, Math.min(AI_WEIGHTS.PROJECTS, score)),
    totalProjects,
  };
};

const scoreCertifications = (candidate) => {
  const totalCertifications = (candidate.certifications || []).length;

  let score = 0;

  if (totalCertifications >= 3) {
    score = AI_WEIGHTS.CERTIFICATIONS;
  } else {
    score = (totalCertifications / 3) * AI_WEIGHTS.CERTIFICATIONS;
  }

  return {
    score: Math.max(0, Math.min(AI_WEIGHTS.CERTIFICATIONS, score)),
    totalCertifications,
  };
};

const scoreKeywords = (job, candidate) => {
  const keywords = (job.keywords || []).map((keyword) =>
    keyword.toLowerCase().trim(),
  );

  const summary = (candidate.summary || "").toLowerCase();

  const matched = keywords.filter((keyword) => summary.includes(keyword));

  const score =
    keywords.length === 0
      ? AI_WEIGHTS.KEYWORDS
      : (matched.length / keywords.length) * AI_WEIGHTS.KEYWORDS;

  return {
    score,
    matchedKeywords: matched,
  };
};

const getRecommendation = (totalScore) => {
  if (totalScore >= 85) {
    return "highly_recommended";
  }

  if (totalScore >= 70) {
    return "recommended";
  }

  if (totalScore >= 50) {
    return "consider";
  }

  return "not_suitable";
};

const screenCandidate = async (job, candidate) => {
  const skills = scoreSkills(job, candidate);

  const experience = scoreExperience(job, candidate);

  const education = scoreEducation(job, candidate);

  const projects = scoreProjects(candidate);

  const certifications = scoreCertifications(candidate);

  const keywords = scoreKeywords(job, candidate);

  const customScore =
    skills.score +
    experience.score +
    education.score +
    projects.score +
    certifications.score +
    keywords.score;

  const customFinalScore = Number(
    Math.max(0, Math.min(100, customScore)).toFixed(2),
  );

  const groqResult = await analyzeCandidateWithGroq(job, candidate);

  const finalScore = Number(
    (customFinalScore * 0.7 + groqResult.semanticScore * 0.3).toFixed(2),
  );

  const recommendation = getRecommendation(finalScore);

  const matchedSkills = [
    ...new Set([...skills.matchedSkills, ...groqResult.matchedSkills]),
  ];

  const missingSkills = [
    ...new Set([...skills.missingSkills, ...groqResult.missingSkills]),
  ];

  const summary = `
${groqResult.summary}

Custom Screening Score: ${customFinalScore.toFixed(1)}

Semantic AI Score: ${groqResult.semanticScore.toFixed(1)}

Final Score: ${finalScore.toFixed(1)}

Recommendation: ${recommendation}
`;

  return {
    aiScore: finalScore,

    matchedSkills,

    missingSkills,

    recommendation,

    aiSummary: summary.trim(),

    breakdown: {
      customScore: customFinalScore,
      semanticScore: groqResult.semanticScore,

      skills: Number(skills.score.toFixed(2)),
      experience: Number(experience.score.toFixed(2)),
      education: Number(education.score.toFixed(2)),
      projects: Number(projects.score.toFixed(2)),
      certifications: Number(certifications.score.toFixed(2)),
      keywords: Number(keywords.score.toFixed(2)),
    },

    strengths: groqResult.strengths,
    weaknesses: groqResult.weaknesses,
  };
};

export default screenCandidate;
