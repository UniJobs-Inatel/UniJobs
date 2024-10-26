import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';


const statusBadgeVariants = cva(
  'gap-2 font-bold text-xs flex flex-row justify-center items-center',
  {
    variants: {
      variant: {
        approved: 'text-[#00C476] ',
        pending: 'text-[#FFCC00]',
        removed: 'text-[#FFCC00]',
      },
      size: {
        default: ' px-2 py-0.5 ',
      },
    },
    defaultVariants: {
      variant: 'approved',
      size: 'default',
    },
  },
);

const circleVariant = {
    approved:'bg-[#26D367]',
    pending:'bg-[#FFCC00]',
    removed:'bg-[#FFCC00]',
}

interface StatusBadgeProps
  extends VariantProps<typeof statusBadgeVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  label: string;
  blink?: boolean;
}

const StatusBadge = ({ variant, size, label, className, ...props }: StatusBadgeProps) => {
  return (
    <div className={cn([statusBadgeVariants({ variant, size }), className])} {...props}>
      <div
        className={cn(`w-[8px] aspect-square rounded-full`, variant && circleVariant[variant])}
      ></div>
      <p className="text-inherit truncate">{label}</p>
    </div>
  );
};

StatusBadge.displayName = 'StatusBadge';

export { StatusBadge };