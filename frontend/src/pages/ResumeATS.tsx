import React, { useState } from 'react';
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
  Download,
  Eye,
  Zap
} from 'lucide-react';

export default function ResumeATS() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setResults({
        score: 85,
        keywords: {
          found: 12,
          missing: 5,
          total: 17
        },
        sections: {
          contact: { score: 100, status: 'excellent' },
          summary: { score: 80, status: 'good' },
          experience: { score: 90, status: 'excellent' },
          skills: { score: 70, status: 'needs_improvement' },
          education: { score: 85, status: 'good' }
        },
        suggestions: [
          'Add more technical skills relevant to the job',
          'Include quantifiable achievements in your experience',
          'Optimize formatting for better ATS scanning',
          'Add missing keywords: "React", "Node.js", "AWS"',
          'Consider adding a professional summary section'
        ],
        compatibility: 'high'
      });
      setAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Resume ATS Analyzer</h1>
          <p className="text-muted-foreground mt-1">
            Upload your resume to analyze ATS compatibility and get optimization suggestions
          </p>
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
                  className="min-w-[120px]"
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
                <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                    ATS Score
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />
                    Keyword Analysis
                  </div>
                  <div className="flex items-center">
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
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Overall Score */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>ATS Compatibility Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(results.score)} mb-2`}>
                    {results.score}%
                  </div>
                  <Badge 
                    variant={results.compatibility === 'high' ? 'default' : 'secondary'}
                    className="mb-4"
                  >
                    {results.compatibility === 'high' ? 'High Compatibility' : 'Needs Improvement'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Keywords Found</span>
                      <span>{results.keywords.found}/{results.keywords.total}</span>
                    </div>
                    <Progress value={(results.keywords.found / results.keywords.total) * 100} />
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Section Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(results.sections).map(([section, data]: [string, any]) => (
                    <div key={section} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(data.status)}
                        <div>
                          <div className="font-medium capitalize">
                            {section.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {data.status.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${getScoreColor(data.score)}`}>
                        {data.score}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.suggestions.map((suggestion: string, index: number) => (
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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