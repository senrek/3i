
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SkillGapsCard = () => {
  return (
    <Card className="border border-border/50 rounded-2xl overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Skill Gaps</CardTitle>
        <CardDescription>
          Areas for improvement based on your target careers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[
            { skill: 'Leadership', level: 'Develop', description: 'Consider taking on team lead roles or management training courses.' },
            { skill: 'Communication', level: 'Enhance', description: 'Practice public speaking and presenting technical concepts to non-technical audiences.' },
            { skill: 'Creativity', level: 'Enhance', description: 'Engage in projects requiring innovative problem-solving and divergent thinking.' },
          ].map((gap, index) => (
            <div key={index} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{gap.skill}</span>
                <Badge 
                  variant="outline" 
                  className={gap.level === 'Develop' 
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700' 
                    : 'border-blue-500 bg-blue-500/10 text-blue-700'}
                >
                  {gap.level}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {gap.description}
              </p>
            </div>
          ))}
        </div>
        
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link to="/reports/skills">
            View Full Skill Analysis
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default SkillGapsCard;
