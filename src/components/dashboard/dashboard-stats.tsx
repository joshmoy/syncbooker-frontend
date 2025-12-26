import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    name: "Total Bookings",
    value: "24",
    change: "+12%",
    icon: Calendar,
  },
  {
    name: "This Week",
    value: "8",
    change: "+4",
    icon: Clock,
  },
  {
    name: "Event Types",
    value: "3",
    change: "Active",
    icon: TrendingUp,
  },
  {
    name: "Unique Visitors",
    value: "156",
    change: "+23%",
    icon: Users,
  },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="body-sm text-muted-foreground">{stat.name}</p>
                <p className="heading-md">{stat.value}</p>
                <p className="body-sm text-muted-foreground">{stat.change}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}