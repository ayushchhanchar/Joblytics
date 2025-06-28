import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const faqs = [
  {
    question: 'How does the ATS analyzer work?',
    answer: 'Our ATS analyzer uses advanced algorithms to scan your resume against common Applicant Tracking System requirements. It checks for keyword density, formatting compatibility, and provides specific recommendations to improve your ATS score and increase your chances of getting past initial screening.',
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Absolutely. We use bank-grade encryption to protect your data, and we never share your personal information with third parties. Your resumes, application data, and analytics remain completely private and are only accessible to you.',
  },
  {
    question: 'Can I track applications from multiple job boards?',
    answer: 'Yes! Joblytics Pro allows you to manually add applications from any job board or company career page. We also provide browser extensions and integrations with popular job boards to automatically sync your applications.',
  },
  {
    question: 'What kind of analytics and insights do you provide?',
    answer: 'Our analytics dashboard shows you response rates, interview conversion rates, application timing patterns, and success metrics by company size, industry, and job type. This helps you identify what\'s working and optimize your job search strategy.',
  },
  {
    question: 'Do you offer a free plan?',
    answer: 'Yes! Our free plan includes basic application tracking for up to 25 applications and one resume analysis per month. Premium plans offer unlimited tracking, advanced analytics, multiple resume analyses, and priority support.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Joblytics Pro and how it can help your job search.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-background shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Additional help section */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@joblyticspro.com"
              className="text-primary hover:underline font-medium"
            >
              Contact Support
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <a
              href="/docs"
              className="text-primary hover:underline font-medium"
            >
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}