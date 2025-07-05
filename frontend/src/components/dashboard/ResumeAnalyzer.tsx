import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
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

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResumeAnalysis | null>(null);
  const [error, setError] = useState<string>('');

  // Load existing analysis on component mount
  useEffect(() => {
    loadExistingAnalysis();
  }, []);

  const loadExistingAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/resume/analysis', {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      
      if (response.data.success) {
        setResults(response.data.analysis);
      }
    } catch (err: any) {
      // No existing analysis found - this is normal for new users
      console.log('No existing resume analysis found');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      
      // Validate file size (5MB limit)
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
      const response = await axios.post('http://localhost:3000/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });
      
      if (response.data.success) {
        setResults(response.data.analysis);
        setFile(null);
        // Reset file input
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
      <Card>
        <CardHeader>
          <CardTitle>📝 Resume Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          📝 Resume Analysis
          {results && (
            <Button
              variant="ghost"
              size="sm"
              onClick={loadExistingAnalysis}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!results ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume">Upload Resume</Label>
              <div className="flex items-center space-x-2">
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
                  className="min-w-[100px]"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Supported: PDF, DOC, DOCX (Max 5MB)
              </p>
            </div>
            
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Upload your resume to get ATS compatibility insights
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center space-y-3">
              <div className={`text-4xl font-bold ${getScoreColor(results.score)} mb-2`}>
                {results.score}%
              </div>
              <Badge className={getCompatibilityColor(results.compatibility)}>
                {results.compatibility.charAt(0).toUpperCase() + results.compatibility.slice(1)} Compatibility
              </Badge>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">{results.keywords.found}</div>
                  <div className="text-muted-foreground">Keywords Found</div>
                </div>
                <div>
                  <div className="font-medium">{results.wordCount}</div>
                  <div className="text-muted-foreground">Word Count</div>
                </div>
              </div>
            </div>

            {/* Keywords Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Keyword Match</span>
                <span>{results.keywords.found}/{Math.min(results.keywords.total, 20)}</span>
              </div>
              <Progress value={(results.keywords.found / Math.min(results.keywords.total, 20)) * 100} />
            </div>

            {/* Section Scores */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Section Breakdown</h4>
              {Object.entries(results.sections).map(([section, data]) => (
                <div key={section} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(data.status)}
                    <span className="text-sm capitalize">{section.replace('_', ' ')}</span>
                  </div>
                  <span className={`text-sm font-medium ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                </div>
              ))}
            </div>

            {/* Top Suggestions */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Top Suggestions
              </h4>
              {results.suggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}