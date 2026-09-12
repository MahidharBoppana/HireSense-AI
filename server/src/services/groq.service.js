import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const analyzeCandidateWithGroq = async (job, candidate) => {
  const prompt = `
You are an AI recruitment screening assistant.

Analyze the candidate against the job requirements.

JOB:
Title: ${job.title}

Description:
${job.description || ""}

Required Skills:
${(job.requiredSkills || []).join(", ")}

Preferred Skills:
${(job.preferredSkills || []).join(", ")}

Experience Required:
${job.experience?.min || 0} - ${job.experience?.max || "any"} years

CANDIDATE:
Name: ${candidate.fullName}

Summary:
${candidate.summary || ""}

Skills:
${(candidate.skills || []).join(", ")}

Experience:
${JSON.stringify(candidate.experience || [])}

Education:
${JSON.stringify(candidate.education || [])}

Projects:
${JSON.stringify(candidate.projects || [])}

Certifications:
${JSON.stringify(candidate.certifications || [])}

Return ONLY valid JSON:

{
  "semanticScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "summary": ""
}

Rules:
- semanticScore must be between 0 and 100.
- matchedSkills must contain skills from the job requirements that the candidate demonstrates.
- missingSkills must contain important required skills the candidate does not demonstrate.
- strengths should contain concise candidate strengths relevant to this job.
- weaknesses should contain concise gaps relevant to this job.
- summary should be a concise professional screening summary.
`;

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You are an expert technical recruiter. Return only valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
    response_format: {
      type: "json_object",
    },
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response");
  }

  const result = JSON.parse(content);

  return {
    semanticScore: Math.max(
      0,
      Math.min(100, Number(result.semanticScore) || 0),
    ),

    matchedSkills: Array.isArray(result.matchedSkills)
      ? result.matchedSkills
      : [],

    missingSkills: Array.isArray(result.missingSkills)
      ? result.missingSkills
      : [],

    strengths: Array.isArray(result.strengths) ? result.strengths : [],

    weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],

    summary: result.summary || "",
  };
};

export default analyzeCandidateWithGroq;
