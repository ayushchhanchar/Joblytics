import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Briefcase, FileText, TrendingUp, Zap, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Briefcase,
    title: 'Track Applications',
    description: 'Log and manage job applications with statuses like "Applied", "Interviewing", "Offer", and more.',
    highlights: ['Real-time status updates', 'Company insights', 'Interview scheduling'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Resume ATS Analyzer',
    description: 'Upload your resume and get insights on ATS readability and keyword matching to improve your chances.',
    highlights: ['ATS compatibility score', 'Keyword optimization', 'Industry benchmarks'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Insights & Analytics',
    description: 'Visual stats on your job hunt performance with actionable insights to improve your success rate.',
    highlights: ['Performance metrics', 'Success patterns', 'Goal tracking'],
    gradient: 'from-emerald-500 to-teal-500',
    badge: 'Coming Soon',
  },
];

const additionalFeatures = [
  {
    icon: Zap,
    title: 'AI-Powered Recommendations',
    description: 'Get personalized job suggestions based on your profile and application history.',
  },
  {
    icon: Shield,
    title: 'Data Privacy & Security',
    description: 'Your data is encrypted and secure. We never share your information with third parties.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Join our community of job seekers sharing tips, experiences, and success stories.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              land your dream job
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools and insights to supercharge your job search and get results faster.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid gap-8 md:grid-cols-3 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="grid gap-6 md:grid-cols-3">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4 p-6 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}