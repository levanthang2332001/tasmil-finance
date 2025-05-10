import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface FeatureCheckboxProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const FeatureCheckbox = ({
  id,
  title,
  description,
  checked,
  onCheckedChange,
  className,
}: FeatureCheckboxProps) => {
  return (
    <div
      className={cn(
        "group grid grid-cols-[auto_1fr] gap-4 p-4 border rounded-lg cursor-pointer",
        "hover:bg-accent/50 transition-colors duration-200",
        "active:scale-[0.98] transform-gpu",
        className
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      <div className="flex items-start pt-1">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="rounded-none group-hover:border-primary"
        />
      </div>
      <div className="space-y-1.5">
        <div className="text-base font-medium group-hover:text-primary transition-colors">
          {title}
        </div>
        <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCheckbox;
