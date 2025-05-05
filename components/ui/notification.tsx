"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const notificationVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        success: "bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800",
        info: "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800",
        warning: "bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800",
        error: "bg-red-100 dark:bg-red-900 border-destructive/50 dark:border-destructive/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: Info,
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  error: XCircle,
}

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  onClose?: () => void
}

const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    const Icon = iconMap[variant || "default"]
    const iconColors = {
      default: "text-foreground",
      success: "text-emerald-600 dark:text-emerald-400",
      info: "text-blue-600 dark:text-blue-400",
      warning: "text-amber-600 dark:text-amber-400",
      error: "text-destructive dark:text-red-400",
    }

    return (
      <div
        ref={ref}
        className={cn(notificationVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-4 w-full">
          <Icon className={cn("h-5 w-5", iconColors[variant || "default"])} />
          <div className="flex-1">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    )
  }
)
Notification.displayName = "Notification"

const NotificationTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium text-sm", className)}
    {...props}
  />
))
NotificationTitle.displayName = "NotificationTitle"

const NotificationDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
NotificationDescription.displayName = "NotificationDescription"

export { Notification, NotificationTitle, NotificationDescription } 