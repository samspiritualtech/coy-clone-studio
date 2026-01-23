import { useRefinementList, UseRefinementListProps } from "react-instantsearch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface AlgoliaRefinementListProps extends UseRefinementListProps {
  title: string;
  className?: string;
}

export const AlgoliaRefinementList = ({
  title,
  className,
  ...props
}: AlgoliaRefinementListProps) => {
  const { items, refine } = useRefinementList(props);

  if (items.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.value}>
            <label className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={item.isRefined}
                onCheckedChange={() => refine(item.value)}
                className="transition-colors"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1">
                {item.label}
              </span>
              <span className="text-xs text-muted-foreground">
                ({item.count})
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};
