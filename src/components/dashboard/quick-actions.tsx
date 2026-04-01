"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Settings } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Create Event Type",
      description: "Add a new event type",
      icon: Calendar,
      href: "/dashboard/events/new",
      onClick: undefined,
    },
    {
      title: "Set Availability",
      description: "Update your schedule",
      icon: Clock,
      href: "/dashboard/availability",
      onClick: undefined,
    },
    {
      title: "Settings",
      description: "Manage your account",
      icon: Settings,
      href: "/dashboard/settings",
      onClick: undefined,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="heading-sm">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => {
            const content = (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-auto py-3"
                onClick={action.onClick}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="label-md">{action.title}</span>
                  <span className="body-sm text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </Button>
            );

            if (action.href) {
              return (
                <Link key={action.title} href={action.href}>
                  {content}
                </Link>
              );
            }

            return <div key={action.title}>{content}</div>;
          })}
        </div>
      </CardContent>
    </Card>
  );
}
