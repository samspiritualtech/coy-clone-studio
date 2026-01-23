import { useRange, UseRangeProps } from "react-instantsearch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AlgoliaPriceRangeProps extends UseRangeProps {
  title?: string;
  className?: string;
}

export const AlgoliaPriceRange = ({
  title = "Price Range",
  className,
  ...props
}: AlgoliaPriceRangeProps) => {
  const { start, range, refine } = useRange(props);

  const min = range.min ?? 0;
  const max = range.max ?? 100000;
  const currentMin = start[0] !== -Infinity ? start[0] : min;
  const currentMax = start[1] !== Infinity ? start[1] : max;

  const handleChange = (value: number[]) => {
    refine([value[0], value[1]]);
  };

  if (min === max) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <Slider
        min={min}
        max={max}
        step={100}
        value={[currentMin ?? min, currentMax ?? max]}
        onValueChange={handleChange}
        className="w-full"
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>₹{(currentMin ?? min).toLocaleString("en-IN")}</span>
        <span>₹{(currentMax ?? max).toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
};
