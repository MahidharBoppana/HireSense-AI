import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const extractTextFromPdf = async (buffer) => {
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  });

  const pdf = await loadingTask.promise;

  let text = "";

  const links = {
    github: "",
    linkedin: "",
    portfolio: "",
    allLinks: [], // Store all raw URLs for project parsing
  };

  const rawAnnotations = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const textContent = await page.getTextContent();

    let lastY = null;
    let pageText = "";

    for (const item of textContent.items) {
      const currentY = item.transform?.[5] ?? 0;

      if (lastY !== null && Math.abs(currentY - lastY) > 3) {
        pageText += "\n";
      }

      pageText += item.str;

      if (item.hasEOL) {
        pageText += "\n";
      } else {
        pageText += " ";
      }

      lastY = currentY;
    }

    text += pageText + "\n";

    // Extract clickable PDF links
    const annotations = await page.getAnnotations();

    for (const annotation of annotations) {
      if (annotation.subtype !== "Link") continue;

      const url =
        annotation.url || annotation.unsafeUrl || annotation.action?.url || "";

      if (!url) continue;

      const trimmedUrl = url.trim();

      // IGNORE EMAIL LINKS
      if (trimmedUrl.toLowerCase().startsWith("mailto:")) continue;

      rawAnnotations.push(trimmedUrl);
    }
  }

  // Combine annotations & text-extracted URLs into one master list
  const urlsInText = text.match(/(?:https?:\/\/|www\.)[^\s<>"']+/gi) || [];
  const allExtractedUrls = Array.from(
    new Set([...rawAnnotations, ...urlsInText]),
  );

  links.allLinks = allExtractedUrls;

  // 1. Process LinkedIn
  const linkedinUrl = allExtractedUrls.find((url) =>
    url.toLowerCase().includes("linkedin.com"),
  );
  if (linkedinUrl) links.linkedin = linkedinUrl;

  // 2. Process GitHub Profile vs Repository Link
  const githubUrls = allExtractedUrls.filter((url) =>
    url.toLowerCase().includes("github.com"),
  );

  if (githubUrls.length > 0) {
    // Prefer shorter profile URL (e.g. github.com/username over github.com/username/repo)
    const profileUrl = githubUrls.find((url) => {
      const pathParts = new URL(
        url.startsWith("http") ? url : `https://${url}`,
      ).pathname
        .split("/")
        .filter(Boolean);
      return pathParts.length <= 1; // username or root
    });

    links.github = profileUrl || githubUrls[0];
  }

  // 3. Process Portfolio (Exclude GitHub, LinkedIn, and Mailto)
  const portfolioUrl = allExtractedUrls.find((url) => {
    const lower = url.toLowerCase();
    return (
      !lower.includes("github.com") &&
      !lower.includes("linkedin.com") &&
      !lower.startsWith("mailto:")
    );
  });

  if (portfolioUrl) links.portfolio = portfolioUrl;

  return {
    text,
    links,
  };
};

export default extractTextFromPdf;
