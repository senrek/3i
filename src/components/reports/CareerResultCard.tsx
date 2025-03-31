
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Download, ChevronDown, ChevronUp, GraduationCap, Briefcase } from 'lucide-react';

interface CareerResultCardProps {
  title: string;
  matchPercentage: number;
  description: string;
  skills: string[];
  isPrimary?: boolean;
  reportId: string;
  educationPathways?: string[];
  workNature?: string[];
}

const CareerResultCard = ({
  title,
  matchPercentage,
  description,
  skills,
  isPrimary = false,
  reportId,
  educationPathways = [],
  workNature = [],
}: CareerResultCardProps) => {
  const [expanded, setExpanded] = useState(isPrimary);

  const getMatchLabel = () => {
    if (matchPercentage >= 80) return 'Excellent Match';
    if (matchPercentage >= 60) return 'Good Match';
    if (matchPercentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const getMatchColor = () => {
    if (matchPercentage >= 80) return 'bg-green-500';
    if (matchPercentage >= 60) return 'bg-emerald-500'; 
    if (matchPercentage >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <Card className={`
      hover-scale subtle-shadow border transition-all duration-300
      ${isPrimary 
        ? 'border-primary/30 bg-primary/5' 
        : 'border-border/50'} 
      rounded-2xl overflow-hidden
    `}>
      <CardHeader className="pb-2">
        {isPrimary && (
          <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
            Top Career Match
          </Badge>
        )}
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Match Score</span>
            <span className="font-medium">{matchPercentage}% - {getMatchLabel()}</span>
          </div>
          <Progress value={matchPercentage} className={`h-2 ${getMatchColor()}`} />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Key Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-background">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {expanded && (
          <>
            {educationPathways && educationPathways.length > 0 && (
              <div className="pt-2 space-y-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Education Pathways</p>
                </div>
                <ul className="text-sm space-y-1 ml-6 list-disc text-muted-foreground">
                  {educationPathways.slice(0, 2).map((path, index) => (
                    <li key={index}>{path}</li>
                  ))}
                </ul>
              </div>
            )}

            {workNature && workNature.length > 0 && (
              <div className="pt-2 space-y-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Work Responsibilities</p>
                </div>
                <ul className="text-sm space-y-1 ml-6 list-disc text-muted-foreground">
                  {workNature.slice(0, 2).map((work, index) => (
                    <li key={index}>{work}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        
        {!isPrimary && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full flex items-center justify-center gap-1 p-0 h-8"
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? (
              <>
                <span className="text-xs">View Less</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span className="text-xs">View More</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button asChild variant="outline" className="flex-1 rounded-xl">
          <Link to={`/reports/${reportId}/career/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <span>Detailed Analysis</span>
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl">
          <Link to={`/reports/${reportId}/download`}>
            <Download className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CareerResultCard;
