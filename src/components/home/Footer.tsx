
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
                <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold">
                  C
                </div>
              </div>
              <span className="text-xl font-semibold">CareerPath</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Empowering individuals to make informed career decisions through 
              scientifically validated assessments and personalized guidance.
            </p>
            <div className="mt-6 flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-5 w-5 rounded-md bg-muted" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Assessments
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Aptitude Test', href: '/assessments/aptitude' },
                { name: 'Personality Assessment', href: '/assessments/personality' },
                { name: 'Career Interest', href: '/assessments/interest' },
                { name: 'Skills Evaluation', href: '/assessments/skills' },
                { name: 'Learning Style', href: '/assessments/learning-style' },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'Career Library', href: '/resources/careers' },
                { name: 'Educational Pathways', href: '/resources/education' },
                { name: 'Industry Insights', href: '/resources/insights' },
                { name: 'Assessment Guide', href: '/resources/guide' },
                { name: 'FAQ', href: '/faq' },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Careers', href: '/careers' },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {currentYear} CareerPath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
