
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface EmptySchoolsStateProps {
  onAddNew: () => void;
}

export function EmptySchoolsState({ onAddNew }: EmptySchoolsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icons.school className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mt-4 mb-2">No schools found</h3>
      <p className="text-muted-foreground mb-6 text-center max-w-sm">
        No schools match your current filters, or no schools have been added yet.
      </p>
      <Button onClick={onAddNew}>
        <Icons.plus className="h-4 w-4 mr-2" />
        Add New School
      </Button>
    </div>
  );
}
