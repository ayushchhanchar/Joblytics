import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Calendar, MapPin, ExternalLink } from 'lucide-react';

const jobApplications = [
  {
    company: 'TechCorp',
    position: 'Senior Frontend Developer',
    location: 'San Francisco, CA',
    appliedDate: '2024-01-15',
    status: 'interviewing',
    logo: '🚀',
  },
  {
    company: 'DataFlow Inc',
    position: 'Full Stack Engineer',
    location: 'New York, NY',
    appliedDate: '2024-01-12',
    status: 'applied',
    logo: '📊',
  },
  {
    company: 'InnovateLab',
    position: 'React Developer',
    location: 'Austin, TX',
    appliedDate: '2024-01-10',
    status: 'offer',
    logo: '💡',
  },
  {
    company: 'CloudScale',
    position: 'Software Engineer',
    location: 'Seattle, WA',
    appliedDate: '2024-01-08',
    status: 'rejected',
    logo: '☁️',
  },
  {
    company: 'StartupXYZ',
    position: 'Frontend Lead',
    location: 'Remote',
    appliedDate: '2024-01-05',
    status: 'applied',
    logo: '⭐',
  },
  {
    company: 'Enterprise Solutions',
    position: 'Technical Lead',
    location: 'Boston, MA',
    appliedDate: '2024-01-03',
    status: 'interviewing',
    logo: '🏢',
  },
];

const statusConfig = {
  applied: { label: 'Applied', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
  interviewing: { label: 'Interviewing', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
  offer: { label: 'Offer', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
};

export function DashboardPreview() {
  return (
    <section className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            See your job hunt{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              at a glance
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Track all your applications in one beautiful dashboard. Never lose track of an opportunity again.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border bg-background shadow-2xl">
            {/* Dashboard Header */}
            <div className="border-b bg-muted/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Job Applications</h3>
                  <p className="text-sm text-muted-foreground">
                    {jobApplications.length} total applications
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    6 active
                  </Badge>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>

            {/* Applications Grid */}
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {jobApplications.map((application, index) => (
                  <Card key={index} className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{application.logo}</div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base truncate">
                              {application.position}
                            </CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Building2 className="h-3 w-3 mr-1" />
                              <span className="truncate">{application.company}</span>
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span>{application.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="pt-2">
                          <Badge 
                            variant={statusConfig[application.status].variant}
                            className={`text-xs ${statusConfig[application.status].color}`}
                          >
                            {statusConfig[application.status].label}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}