
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Download } from 'lucide-react';

interface CareerResultCardProps {
  title: string;
  matchPercentage: number;
  description: string;
  skills: string[];
  isPrimary?: boolean;
  reportId: string;
}

const CareerResultCard = ({
  title,
  matchPercentage,
  description,
  skills,
  isPrimary = false,
  reportId,
}: CareerResultCardProps) => {
  const getMatchLabel = () => {
    if (matchPercentage >= 80) return 'Excellent Match';
    if (matchPercentage >= 60) return 'Good Match';
    if (matchPercentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <Card className={`
      hover-scale subtle-shadow border 
      ${isPrimary 
        ? 'border-primary/30 bg-primary/5' 
        : 'border-border/50'} 
      rounded-2xl overflow-hidden
    `}>
      <CardHeader className="pb-2">
        {isPrimary && (
          <Badge className="w-fit mb-2 bg-primary text-primary-foreground">
            Top Match
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
          <Progress value={matchPercentage} className="h-2" />
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Key Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-background">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button asChild variant="outline" className="flex-1 rounded-xl">
          <Link to={`/reports/${reportId}/career/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <span>Details</span>
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
