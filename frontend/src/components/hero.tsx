import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  const navigate=useNavigate();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/20 to-muted/50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
            Now in Beta - Join the early adopters
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            Your Ultimate{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Job Search
            </span>{' '}
            Companion
          </h1>
          
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Track your applications, analyze your resume, and land your dream job with ease. 
            Get AI-powered insights and never lose track of your opportunities again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={() => {navigate('/register')}} size="lg" className="text-lg px-8 py-6 h-auto group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>✨ No credit card required • 📊 Free analytics • 🚀 Get started in 2 minutes</p>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary/20 to-purple-600/20 blur-3xl"></div>
      </div>
    </section>
  );
}