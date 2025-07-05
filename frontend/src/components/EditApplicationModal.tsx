import  { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import {
  ApplicationStatusList,
  ApplicationStatusLabels,
} from '../constants/application-status';

const schema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url('Please enter a valid URL'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(ApplicationStatusList),
  appliedAt: z.date().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Application {
  id: string;
  company: string;
  role: string;
  jobUrl: string;
  location: string;
  status: keyof typeof ApplicationStatusLabels;
  appliedAt: string;
  notes?: string;
}

interface EditApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  application: Application | null;
}

export function EditApplicationModal({
  open,
  onOpenChange,
  onSuccess,
  application,
}: EditApplicationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchedDate = watch('appliedAt');
  const watchedStatus = watch('status');

  // Populate form when application changes
  useEffect(() => {
    if (application && open) {
      setValue('company', application.company);
      setValue('role', application.role);
      setValue('jobUrl', application.jobUrl);
      setValue('location', application.location);
      setValue('status', application.status);
      setValue('appliedAt', new Date(application.appliedAt));
      setValue('notes', application.notes || '');
    }
  }, [application, open, setValue]);

  const onSubmit = async (data: FormData) => {
    console.log("------------",data);
    if (!application) return;

    setIsLoading(true);
    setError('');

    try {
      const payload = {
        ...data,
        appliedAt: data.appliedAt || new Date(),
      };
      console.log("payload-----",payload);

      await axios.patch(
        `https://joblytics.notdeveloper.in/api/applications/${application.id}`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );

      reset();
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(
        err.response?.data?.error || 'Failed to update application. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onOpenChange(false);
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update the details for your job application.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="e.g. Google, Microsoft"
                {...register('company')}
                className={errors.company ? 'border-destructive' : ''}
              />
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Job Title *</Label>
              <Input
                id="role"
                placeholder="e.g. Software Engineer"
                {...register('role')}
                className={errors.role ? 'border-destructive' : ''}
              />
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g. San Francisco, CA or Remote"
              {...register('location')}
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL *</Label>
            <Input
              id="jobUrl"
              type="url"
              placeholder="https://company.com/jobs/123"
              {...register('jobUrl')}
              className={errors.jobUrl ? 'border-destructive' : ''}
            />
            {errors.jobUrl && (
              <p className="text-sm text-destructive">{errors.jobUrl.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={watchedStatus}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ApplicationStatusList.map((status) => (
                    <SelectItem key={status} value={status}>
                      {ApplicationStatusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Applied Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !watchedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watchedDate ? format(watchedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchedDate}
                    onSelect={(date) => setValue('appliedAt', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this application..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Application'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}