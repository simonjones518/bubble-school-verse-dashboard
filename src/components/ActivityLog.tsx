
import React from "react";
import { cn } from "@/lib/utils";

type ActivityLogProps = {
  activities: Array<{
    id: string | number;
    user: {
      name: string;
      avatar?: string;
    };
    action: string;
    target: string;
    time: string;
  }>;
  className?: string;
};

export function ActivityLog({ activities, className }: ActivityLogProps) {
  return (
    <div className={cn("bubble-card", className)}>
      <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-bubble-light flex items-center justify-center text-bubble-primary font-medium">
              {activity.user.avatar ? (
                <img
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                activity.user.name.charAt(0)
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user.name}</span>{" "}
                {activity.action}{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-bubble-neutral">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
