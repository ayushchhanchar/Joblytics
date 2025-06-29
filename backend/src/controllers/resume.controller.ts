import { Request, Response } from "express";
import { Client } from "../conifg/prisma";
import pdfParse from "pdf-parse";
import fs from "fs";

interface ResumeAnalysis {
  score: number;
  keywords: {
    found: number;
    missing: number;
    total: number;
    foundKeywords: string[];
    missingKeywords: string[];
  };
  sections: {
    contact: { score: number; status: string; issues: string[] };
    summary: { score: number; status: string; issues: string[] };
    experience: { score: number; status: string; issues: string[] };
    skills: { score: number; status: string; issues: string[] };
    education: { score: number; status: string; issues: string[] };
  };
  suggestions: string[];
  compatibility: string;
  wordCount: number;
  readabilityScore: number;
}

// Common keywords for tech jobs (can be expanded or made dynamic)
const COMMON_KEYWORDS = [
  'javascript', 'react', 'node.js', 'python', 'java', 'sql', 'aws', 'docker',
  'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'mongodb',
  'postgresql', 'redis', 'microservices', 'ci/cd', 'devops', 'cloud', 'azure',
  'gcp', 'machine learning', 'ai', 'data analysis', 'typescript', 'vue.js',
  'angular', 'express', 'spring', 'django', 'flask', 'laravel', 'php',
  'c++', 'c#', '.net', 'ruby', 'rails', 'go', 'rust', 'swift', 'kotlin'
];

const analyzeResumeText = (text: string): ResumeAnalysis => {
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).length;
  
  // Keyword analysis
  const foundKeywords = COMMON_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  );
  const missingKeywords = COMMON_KEYWORDS.filter(keyword => 
    !lowerText.includes(keyword.toLowerCase())
  ).slice(0, 10); // Show top 10 missing

  // Section analysis
  const sections = {
    contact: analyzeContactSection(text),
    summary: analyzeSummarySection(text),
    experience: analyzeExperienceSection(text),
    skills: analyzeSkillsSection(text),
    education: analyzeEducationSection(text)
  };

  // Calculate overall score
  const sectionScores = Object.values(sections).map(s => s.score);
  const avgSectionScore = sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length;
  const keywordScore = (foundKeywords.length / Math.min(COMMON_KEYWORDS.length, 20)) * 100;
  const lengthScore = words >= 300 && words <= 800 ? 100 : words < 300 ? 60 : 80;
  
  const overallScore = Math.round((avgSectionScore * 0.6 + keywordScore * 0.3 + lengthScore * 0.1));

  // Generate suggestions
  const suggestions = generateSuggestions(sections, foundKeywords.length, words);

  return {
    score: Math.min(overallScore, 100),
    keywords: {
      found: foundKeywords.length,
      missing: missingKeywords.length,
      total: COMMON_KEYWORDS.length,
      foundKeywords,
      missingKeywords
    },
    sections,
    suggestions,
    compatibility: overallScore >= 80 ? 'high' : overallScore >= 60 ? 'medium' : 'low',
    wordCount: words,
    readabilityScore: calculateReadabilityScore(text)
  };
};

const analyzeContactSection = (text: string) => {
  const issues: string[] = [];
  let score = 100;

  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/i;

  if (!emailRegex.test(text)) {
    issues.push("Missing email address");
    score -= 30;
  }
  if (!phoneRegex.test(text)) {
    issues.push("Missing phone number");
    score -= 25;
  }
  if (!linkedinRegex.test(text)) {
    issues.push("Missing LinkedIn profile");
    score -= 20;
  }

  return {
    score: Math.max(score, 0),
    status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs_improvement',
    issues
  };
};

const analyzeSummarySection = (text: string) => {
  const issues: string[] = [];
  let score = 100;
  const lowerText = text.toLowerCase();

  const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
  const hasSummary = summaryKeywords.some(keyword => lowerText.includes(keyword));

  if (!hasSummary) {
    issues.push("Consider adding a professional summary");
    score -= 40;
  }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length < 3) {
    issues.push("Summary should be 3-4 sentences long");
    score -= 30;
  }

  return {
    score: Math.max(score, 0),
    status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs_improvement',
    issues
  };
};

const analyzeExperienceSection = (text: string) => {
  const issues: string[] = [];
  let score = 100;
  const lowerText = text.toLowerCase();

  const experienceKeywords = ['experience', 'work', 'employment', 'career'];
  const hasExperience = experienceKeywords.some(keyword => lowerText.includes(keyword));

  if (!hasExperience) {
    issues.push("Missing work experience section");
    score -= 50;
  }

  // Check for quantifiable achievements
  const numberRegex = /\d+%|\d+\+|\$\d+|\d+k|\d+ years?|\d+ months?/gi;
  const quantifiableAchievements = text.match(numberRegex);
  
  if (!quantifiableAchievements || quantifiableAchievements.length < 3) {
    issues.push("Add more quantifiable achievements with numbers");
    score -= 30;
  }

  // Check for action verbs
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'implemented', 'improved', 'increased', 'reduced'];
  const hasActionVerbs = actionVerbs.some(verb => lowerText.includes(verb));
  
  if (!hasActionVerbs) {
    issues.push("Use strong action verbs to describe achievements");
    score -= 20;
  }

  return {
    score: Math.max(score, 0),
    status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs_improvement',
    issues
  };
};

const analyzeSkillsSection = (text: string) => {
  const issues: string[] = [];
  let score = 100;
  const lowerText = text.toLowerCase();

  const skillsKeywords = ['skills', 'technologies', 'technical', 'tools'];
  const hasSkills = skillsKeywords.some(keyword => lowerText.includes(keyword));

  if (!hasSkills) {
    issues.push("Missing skills section");
    score -= 40;
  }

  const techSkillsCount = COMMON_KEYWORDS.filter(keyword => 
    lowerText.includes(keyword.toLowerCase())
  ).length;

  if (techSkillsCount < 5) {
    issues.push("Add more relevant technical skills");
    score -= 30;
  }

  return {
    score: Math.max(score, 0),
    status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs_improvement',
    issues
  };
};

const analyzeEducationSection = (text: string) => {
  const issues: string[] = [];
  let score = 100;
  const lowerText = text.toLowerCase();

  const educationKeywords = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd'];
  const hasEducation = educationKeywords.some(keyword => lowerText.includes(keyword));

  if (!hasEducation) {
    issues.push("Consider adding education section");
    score -= 30;
  }

  return {
    score: Math.max(score, 0),
    status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs_improvement',
    issues
  };
};

const generateSuggestions = (sections: any, keywordCount: number, wordCount: number): string[] => {
  const suggestions: string[] = [];

  if (sections.contact.score < 80) {
    suggestions.push("Complete your contact information with email, phone, and LinkedIn");
  }
  
  if (sections.experience.score < 80) {
    suggestions.push("Add quantifiable achievements with specific numbers and metrics");
  }
  
  if (keywordCount < 10) {
    suggestions.push("Include more relevant technical keywords from job descriptions");
  }
  
  if (wordCount < 300) {
    suggestions.push("Expand your resume content - aim for 300-800 words");
  } else if (wordCount > 800) {
    suggestions.push("Consider condensing your resume - keep it concise and relevant");
  }
  
  if (sections.skills.score < 80) {
    suggestions.push("Create a dedicated skills section with relevant technologies");
  }

  suggestions.push("Use consistent formatting and standard section headers");
  suggestions.push("Tailor your resume keywords to match specific job descriptions");

  return suggestions.slice(0, 6); // Limit to 6 suggestions
};

const calculateReadabilityScore = (text: string): number => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.split(/\s+/).length;
  const avgWordsPerSentence = words / sentences;
  
  // Simple readability score (lower is better for resumes)
  if (avgWordsPerSentence <= 15) return 90;
  if (avgWordsPerSentence <= 20) return 75;
  if (avgWordsPerSentence <= 25) return 60;
  return 45;
};

export const analyzeResume = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded" });
    }

    // Parse PDF
    const buffer = fs.readFileSync(req.file.path);
    const parsedPdf = await pdfParse(buffer);
    const resumeText = parsedPdf.text;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: "Could not extract text from resume or content too short" });
    }

    // Analyze the resume
    const analysis = analyzeResumeText(resumeText);

    // Save analysis to database (optional)
    try {
      await Client.user.update({
        where: { id: req.user.userId },
        data: {
          resumeText: resumeText,
          resumeUrl: `/uploads/resumes/${req.file.filename}`
        }
      });
    } catch (dbError) {
      console.error("Database update error:", dbError);
      // Continue with response even if DB update fails
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      analysis,
      message: "Resume analyzed successfully"
    });

  } catch (error) {
    console.error("Resume analysis error:", error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: "Failed to analyze resume. Please ensure the file is a valid PDF." 
    });
  }
};

export const getResumeAnalysis = async (req: Request & { user?: any }, res: Response) => {
  try {
    const user = await Client.user.findUnique({
      where: { id: req.user.userId },
      select: { resumeText: true, resumeUrl: true }
    });

    if (!user || !user.resumeText) {
      return res.status(404).json({ error: "No resume found for analysis" });
    }

    const analysis = analyzeResumeText(user.resumeText);
    
    res.json({
      success: true,
      analysis,
      resumeUrl: user.resumeUrl
    });

  } catch (error) {
    console.error("Get resume analysis error:", error);
    res.status(500).json({ error: "Failed to get resume analysis" });
  }
};