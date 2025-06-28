import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

export function ResumeAnalyzer() {
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
        keywords: 12,
        suggestions: [
          'Add more technical skills',
          'Include quantifiable achievements',
          'Optimize for ATS scanning'
        ]
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Resume Analysis</CardTitle>
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
                      <Upload className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {!file && (
              <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Upload your resume to get ATS compatibility insights
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {results.score}%
                </div>
                <p className="text-sm text-muted-foreground">ATS Score</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {results.keywords}
                </div>
                <p className="text-sm text-muted-foreground">Keywords Found</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">
                  {results.suggestions.length}
                </div>
                <p className="text-sm text-muted-foreground">Suggestions</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Improvement Suggestions
              </h4>
              {results.suggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={() => {
                setResults(null);
                setFile(null);
              }}
              className="w-full"
            >
              Analyze Another Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}