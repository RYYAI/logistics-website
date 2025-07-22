import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:h-4 [&>svg]:w-4 [&>svg+div]:translate-y-[-3px] [&:has([role=alert])]:-mt-2",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 bg-destructive text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => {
  return <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  },
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("text-sm [&:not(:first-child)]:mt-1", className)} {...props} />
  },
)
AlertDescription.displayName = "AlertDescription"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        secondary: "border border-secondary bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-input bg-transparent text-input",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription, Badge, badgeVariants }
