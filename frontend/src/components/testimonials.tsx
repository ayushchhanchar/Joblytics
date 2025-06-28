import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Meta',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Joblytics Pro completely transformed my job search. The ATS analyzer helped me optimize my resume, and I landed 3 interviews in just two weeks!',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Product Manager',
    company: 'Google',
    image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'The application tracking feature is a game-changer. I never missed a follow-up again, and the analytics showed me exactly where to improve my approach.',
    rating: 5,
  },
  {
    name: 'Emily Johnson',
    role: 'UX Designer',
    company: 'Spotify',
    image: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Finally, a tool that understands job seekers! The insights helped me understand my patterns and adjust my strategy. Got my dream job in 6 weeks.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Join thousands of{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              successful job seekers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how Joblytics Pro has helped professionals land their dream jobs faster.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-base leading-relaxed mb-6">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by job seekers at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-muted-foreground">Google</div>
            <div className="text-2xl font-bold text-muted-foreground">Meta</div>
            <div className="text-2xl font-bold text-muted-foreground">Netflix</div>
            <div className="text-2xl font-bold text-muted-foreground">Spotify</div>
            <div className="text-2xl font-bold text-muted-foreground">Uber</div>
          </div>
        </div>
      </div>
    </section>
  );
}