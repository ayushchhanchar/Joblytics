import { Button } from './ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-purple-600 p-8 md:p-16 text-white">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-black tracking-tight sm:text-4xl md:text-5xl mb-6">
                Start tracking your job hunt today
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-black leading-relaxed">
                Join thousands of successful job seekers who landed their dream jobs faster with Joblytics Pro.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto border-white/30 text-white hover:bg-white/10"
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm opacity-90">
                <div className="flex items-center text-black">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Free 14-day trial
                </div>
                <div className="flex items-center text-black">
                  <CheckCircle className="h-4 w-4 mr-2 " />
                  No credit card required
                </div>
                <div className="flex items-center text-black">
                  <CheckCircle className="h-4 w-4 mr-2 " />
                  Cancel anytime
                </div>
              </div>
            </div>

            {/* Background decoration - optimized for both light and dark modes */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-white/10 dark:to-transparent"></div>
            <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-purple-300/15 to-transparent dark:from-purple-400/25 dark:to-transparent blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-blue-300/15 to-transparent dark:from-blue-400/25 dark:to-transparent blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}