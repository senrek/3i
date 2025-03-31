
import React from 'react';
import { Link } from 'react-router-dom';
import { Filter, ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ReportHeader = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Assessment Reports</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Reports</DropdownMenuItem>
              <DropdownMenuItem>Completed Reports</DropdownMenuItem>
              <DropdownMenuItem>Incomplete Reports</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size="sm" variant="outline" className="gap-1">
            <Link to="/reports/download">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Link>
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        View your assessment results and career recommendations
      </p>
    </div>
  );
};

export default ReportHeader;
