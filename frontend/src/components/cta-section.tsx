import { Button } from "./ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-primary dark:via-primary dark:to-purple-600 p-8 md:p-16 text-white dark:text-black">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6 text-white dark:text-gray-900">
                Start tracking your job hunt today
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed text-gray-300 dark:text-gray-700">
                Join thousands of successful job seekers who landed their dream
                jobs faster with Joblytics Pro.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 h-auto text-white bg-white/10  dark:text-black border-white/30 hover:bg-white hover:text-black dark:hover:bg-black/10"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto text-white bg-white/10  dark:text-black border-white/30 hover:bg-white hover:text-black dark:hover:bg-black/10"
                >
                  Schedule Demo
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm opacity-90">
                <div className="flex items-center text-gray-300 dark:text-gray-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Free 14-day trial
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center text-gray-300 dark:text-gray-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Cancel anytime
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-purple-100/20 to-white/20 dark:from-white/5 dark:via-purple-900/20 dark:to-black/10"></div>
            <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-purple-300/40 via-white/10 to-transparent dark:from-purple-900/30 dark:via-purple-800/20 dark:to-transparent blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-black/10 via-purple-200/20 to-white/10 dark:from-black/20 dark:via-purple-900/20 dark:to-black/10 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
