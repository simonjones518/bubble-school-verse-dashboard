
import { cn } from "@/lib/utils";

type TimelineEvent = {
  id: string | number;
  title: string;
  time: string;
  description?: string;
  status?: "upcoming" | "ongoing" | "completed";
};

type TimelineProps = {
  events: TimelineEvent[];
  className?: string;
};

export function TimelineComponent({ events, className }: TimelineProps) {
  return (
    <div className={cn("bubble-card", className)}>
      <h2 className="text-lg font-medium mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex">
            <div className="mr-4 flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  event.status === "completed"
                    ? "bg-green-500"
                    : event.status === "ongoing"
                    ? "bg-bubble-primary"
                    : "bg-bubble-light border border-bubble-primary"
                )}
              />
              {index !== events.length - 1 && (
                <div className="w-0.5 h-full bg-gray-200 my-1" />
              )}
            </div>
            <div className="flex flex-col pb-4">
              <h4 className="font-medium text-sm">{event.title}</h4>
              <span className="text-xs text-bubble-neutral">{event.time}</span>
              {event.description && (
                <p className="text-xs text-gray-500 mt-1">{event.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
