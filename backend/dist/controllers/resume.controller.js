"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResumeAnalysis = exports.analyzeResume = void 0;
const prisma_1 = require("../conifg/prisma");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const fs_1 = __importDefault(require("fs"));
const COMMON_KEYWORDS = [
    'javascript', 'react', 'node.js', 'python', 'java', 'sql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'api', 'rest', 'graphql', 'mongodb',
    'postgresql', 'redis', 'microservices', 'ci/cd', 'devops', 'cloud', 'azure',
    'gcp', 'machine learning', 'ai', 'data analysis', 'typescript', 'vue.js',
    'angular', 'express', 'spring', 'django', 'flask', 'laravel', 'php',
    'c++', 'c#', '.net', 'ruby', 'rails', 'go', 'rust', 'swift', 'kotlin'
];
const analyzeResumeText = (text) => {
    const lowerText = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    const foundKeywords = COMMON_KEYWORDS.filter(k => lowerText.includes(k));
    const missingKeywords = COMMON_KEYWORDS.filter(k => !lowerText.includes(k)).slice(0, 15);
    const sections = {
        contact: analyzeContactSection(text),
        summary: analyzeSummarySection(text),
        experience: analyzeExperienceSection(text),
        skills: analyzeSkillsSection(text),
        education: analyzeEducationSection(text),
    };
    const sectionScores = Object.values(sections).map(s => s.score);
    const avgSectionScore = sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length;
    const keywordRatio = foundKeywords.length / COMMON_KEYWORDS.length;
    const keywordScore = Math.min(keywordRatio * 100, 100);
    let lengthScore = 0;
    if (wordCount >= 400 && wordCount <= 750) {
        lengthScore = 100;
    }
    else if (wordCount >= 300 && wordCount <= 850) {
        lengthScore = 70;
    }
    else {
        lengthScore = 40;
    }
    const formattingIssues = [];
    if (!text.includes('•') && !text.includes('- ')) {
        formattingIssues.push('No bullet points used');
    }
    if ((text.match(/[A-Z]{8,}/g) || []).length > 5) {
        formattingIssues.push('Too many all-uppercase words');
    }
    const formattingScore = formattingIssues.length ? 60 : 100;
    const overallScore = Math.round(avgSectionScore * 0.4 +
        keywordScore * 0.3 +
        lengthScore * 0.2 +
        formattingScore * 0.1);
    const suggestions = generateSuggestions(sections, foundKeywords.length, wordCount, formattingIssues);
    return {
        score: Math.min(overallScore, 100),
        keywords: {
            found: foundKeywords.length,
            missing: missingKeywords.length,
            total: COMMON_KEYWORDS.length,
            foundKeywords,
            missingKeywords,
        },
        sections,
        suggestions,
        compatibility: overallScore >= 85 ? 'high' : overallScore >= 65 ? 'medium' : 'low',
        wordCount,
        readabilityScore: calculateReadabilityScore(text),
    };
};
const analyzeContactSection = (text) => {
    const issues = [];
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
const analyzeSummarySection = (text) => {
    const issues = [];
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
const analyzeExperienceSection = (text) => {
    const issues = [];
    let score = 100;
    const lowerText = text.toLowerCase();
    const experienceKeywords = ['experience', 'work', 'employment', 'career'];
    const hasExperience = experienceKeywords.some(keyword => lowerText.includes(keyword));
    if (!hasExperience) {
        issues.push("Missing work experience section");
        score -= 50;
    }
    const numberRegex = /\d+%|\d+\+|\$\d+|\d+k|\d+ years?|\d+ months?/gi;
    const quantifiableAchievements = text.match(numberRegex);
    if (!quantifiableAchievements || quantifiableAchievements.length < 3) {
        issues.push("Add more quantifiable achievements with numbers");
        score -= 30;
    }
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
const analyzeSkillsSection = (text) => {
    const issues = [];
    let score = 100;
    const lowerText = text.toLowerCase();
    const skillsKeywords = ['skills', 'technologies', 'technical', 'tools'];
    const hasSkills = skillsKeywords.some(keyword => lowerText.includes(keyword));
    if (!hasSkills) {
        issues.push("Missing skills section");
        score -= 40;
    }
    const techSkillsCount = COMMON_KEYWORDS.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;
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
const analyzeEducationSection = (text) => {
    const issues = [];
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
const generateSuggestions = (sections, keywordCount, wordCount, formattingIssues = []) => {
    const suggestions = [];
    if (sections.contact.score < 80)
        suggestions.push("Add valid contact info including email, phone, and LinkedIn");
    if (sections.skills.score < 80)
        suggestions.push("Add a dedicated skills section with tools/technologies");
    if (keywordCount < 12)
        suggestions.push("Incorporate more job-specific keywords to match ATS parsing");
    if (wordCount < 400)
        suggestions.push("Resume is too short – add more experience or detail");
    if (wordCount > 850)
        suggestions.push("Resume is too long – try to condense to 1–2 pages");
    suggestions.push(...formattingIssues);
    return suggestions.slice(0, 6);
};
const calculateReadabilityScore = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / sentences;
    // Simple readability score (lower is better for resumes)
    if (avgWordsPerSentence <= 15)
        return 90;
    if (avgWordsPerSentence <= 20)
        return 75;
    if (avgWordsPerSentence <= 25)
        return 60;
    return 45;
};
const analyzeResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No resume file uploaded" });
        }
        const buffer = fs_1.default.readFileSync(req.file.path);
        const parsedPdf = yield (0, pdf_parse_1.default)(buffer);
        const resumeText = parsedPdf.text;
        if (!resumeText || resumeText.trim().length < 50) {
            return res.status(400).json({ error: "Could not extract text from resume or content too short" });
        }
        const analysis = analyzeResumeText(resumeText);
        // Save analysis to database (optional)
        try {
            yield prisma_1.Client.user.update({
                where: { id: req.user.userId },
                data: {
                    resumeText: resumeText,
                    resumeUrl: `/uploads/resumes/${req.file.filename}`
                }
            });
        }
        catch (dbError) {
            console.error("Database update error:", dbError);
        }
        fs_1.default.unlinkSync(req.file.path);
        res.json({
            success: true,
            analysis,
            message: "Resume analyzed successfully"
        });
    }
    catch (error) {
        console.error("Resume analysis error:", error);
        if (req.file && fs_1.default.existsSync(req.file.path)) {
            fs_1.default.unlinkSync(req.file.path);
        }
        res.status(500).json({
            error: "Failed to analyze resume. Please ensure the file is a valid PDF."
        });
    }
});
exports.analyzeResume = analyzeResume;
const getResumeAnalysis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.Client.user.findUnique({
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
    }
    catch (error) {
        console.error("Get resume analysis error:", error);
        res.status(500).json({ error: "Failed to get resume analysis" });
    }
});
exports.getResumeAnalysis = getResumeAnalysis;
