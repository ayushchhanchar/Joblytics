import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

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
    [key: string]: {
      score: number;
      status: string;
      issues: string[];
    };
  };
  suggestions: string[];
  compatibility: string;
  wordCount: number;
  readabilityScore: number;
}

export default function ResumeATS() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadExistingAnalysis();
  }, []);

  const loadExistingAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://joblytics.notdeveloper.in/resume/analysis', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      
      if (response.data.success) {
        setResults(response.data.analysis);
      }
    } catch (err: any) {
      console.log('No existing resume analysis found');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setError('');
    
    const formData = new FormData();
    formData.append('resume', file);
    
    try {
      const response = await axios.post('https://joblytics.notdeveloper.in/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });
      
      if (response.data.success) {
        setResults(response.data.analysis);
        setFile(null);
        const fileInput = document.getElementById('resume') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'needs_improvement':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Resume ATS Analyzer</h1>
            <p className="text-muted-foreground mt-1">
              Upload your resume to analyze ATS compatibility and get optimization suggestions
            </p>
          </div>
          {results && (
            <Button
              variant="outline"
              onClick={loadExistingAnalysis}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Choose your resume file</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAnalyze}
                  disabled={!file || analyzing}
                  className="min-w-[120px] w-full sm:w-auto"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
            
            {!file && !results && (
              <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">Upload your resume</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant feedback on ATS compatibility and optimization tips
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    ATS Score
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />
                    Keyword Analysis
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-purple-600" />
                    Improvement Tips
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {results && (
          <div className="grid gap-6 xl:grid-cols-3">
            {/* Overall Score */}
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle>ATS Compatibility Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl md:text-6xl font-bold ${getScoreColor(results.score)} mb-2`}>
                    {results.score}%
                  </div>
                  <Badge className={getCompatibilityColor(results.compatibility)}>
                    {results.compatibility.charAt(0).toUpperCase() + results.compatibility.slice(1)} Compatibility
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Keywords Found</span>
                      <span>{results.keywords.found}/{Math.min(results.keywords.total, 20)}</span>
                    </div>
                    <Progress value={(results.keywords.found / Math.min(results.keywords.total, 20)) * 100} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center text-sm">
                    <div>
                      <div className="font-medium text-lg">{results.wordCount}</div>
                      <div className="text-muted-foreground">Words</div>
                    </div>
                    <div>
                      <div className="font-medium text-lg">{results.readabilityScore}%</div>
                      <div className="text-muted-foreground">Readability</div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => {
                    setResults(null);
                    setFile(null);
                  }}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Analyze New Resume
                </Button>
              </CardContent>
            </Card>

            {/* Section Breakdown */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle>Section Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(results.sections).map(([section, data]) => (
                    <div key={section} className="space-y-2 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(data.status)}
                          <span className="font-medium capitalize">
                            {section.replace('_', ' ')}
                          </span>
                        </div>
                        <span className={`text-lg font-semibold ${getScoreColor(data.score)}`}>
                          {data.score}%
                        </span>
                      </div>
                      {data.issues.length > 0 && (
                        <div className="space-y-1">
                          {data.issues.slice(0, 2).map((issue, index) => (
                            <p key={index} className="text-xs text-muted-foreground">
                              • {issue}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Keywords Found/Missing */}
            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle>Keyword Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Found Keywords ({results.keywords.found})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.foundKeywords.slice(0, 15).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-yellow-600 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Suggested Keywords ({results.keywords.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.keywords.missingKeywords.slice(0, 15).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="xl:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {results.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tips Section */}
        {!results && (
          <Card>
            <CardHeader>
              <CardTitle>ATS Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Use Standard Headings</h4>
                  <p className="text-sm text-muted-foreground">
                    Use conventional section headers like "Experience", "Education", "Skills"
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Include Keywords</h4>
                  <p className="text-sm text-muted-foreground">
                    Match keywords from job descriptions in your resume content
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Simple Formatting</h4>
                  <p className="text-sm text-muted-foreground">
                    Avoid complex layouts, graphics, and unusual fonts
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Quantify Achievements</h4>
                  <p className="text-sm text-muted-foreground">
                    Use numbers and metrics to demonstrate your impact
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Standard File Format</h4>
                  <p className="text-sm text-muted-foreground">
                    Save as PDF or Word document for best compatibility
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Include phone, email, and LinkedIn profile clearly
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}