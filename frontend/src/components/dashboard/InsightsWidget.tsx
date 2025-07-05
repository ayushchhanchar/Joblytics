import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { TrendingUp, BarChart3, Eye } from 'lucide-react';

export function InsightsWidget() {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-600/5"></div>
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            📈 Insights & Progress
            <Badge variant="secondary" className="ml-2 text-xs">
              Coming Soon
            </Badge>
          </span>
          <Eye className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="text-center py-8">
          <div className="mb-4">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visualize trends in your job hunt, track success rates, and get personalized insights to improve your application strategy.
          </p>
          
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-3 w-3" />
              <span>Application success rates</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <BarChart3 className="h-3 w-3" />
              <span>Industry trends & benchmarks</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Eye className="h-3 w-3" />
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}