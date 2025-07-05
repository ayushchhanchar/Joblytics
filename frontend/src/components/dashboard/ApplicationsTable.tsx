import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { MoreHorizontal, Edit, Trash2, ExternalLink, Briefcase, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ApplicationStatusLabels } from '../../constants/application-status';

interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: keyof typeof ApplicationStatusLabels;
  appliedAt: string;
  jobUrl?: string;
}

interface ApplicationsTableProps {
  applications: Application[];
  onEdit?: (application: Application) => void;
  onDelete?: (id: string) => void;
  onAddClick?: () => void;
}

export function ApplicationsTable({ applications, onEdit, onDelete, onAddClick }: ApplicationsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'INTERVIEWING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'OFFER':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'GHOSTED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2" />
            Your Applications
          </span>
          {onAddClick && (
            <Button size="sm" onClick={onAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No applications yet</p>
              <p className="text-sm">Start tracking your job applications</p>
            </div>
            {onAddClick && (
              <Button onClick={onAddClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Application
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Job Title</TableHead>
                    <TableHead className="min-w-[150px]">Company</TableHead>
                    <TableHead className="min-w-[120px] hidden md:table-cell">Location</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Applied Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{application.role}</p>
                            <p className="text-sm text-muted-foreground md:hidden">
                              {application.company}
                            </p>
                          </div>
                          {application.jobUrl && (
                            <a
                              href={application.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary flex-shrink-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{application.company}</TableCell>
                      <TableCell className="hidden md:table-cell">{application.location}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(application.status)} text-xs`}>
                          {ApplicationStatusLabels[application.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit?.(application)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete?.(application.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}