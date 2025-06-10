"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

// VisuallyHidden component for accessibility
const VisuallyHidden = ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className="absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
      style={{ clip: "rect(0 0 0 0)" }}
      {...props}
    >
      {children}
    </span>
  );
};
VisuallyHidden.displayName = "VisuallyHidden";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 backdrop-blur-[12px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    title?: string; // Optional title prop for accessibility
  }
>(({ className, children, title = "Dialog", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl",
        "bg-gradient-to-b from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-[180%]",
        "border border-[rgba(255,255,255,0.1)] shadow-[0_20px_80px_rgba(0,0,0,0.3)]",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-b after:from-[rgba(255,255,255,0.12)] after:to-transparent after:opacity-50",
        "dark:bg-gradient-to-b dark:from-[rgba(20,20,40,0.8)] dark:to-[rgba(10,10,30,0.9)]",
        className
      )}
      {...props}
    >
      {/* Add a visually hidden title for screen readers if no DialogTitle is provided */}
      {!React.Children.toArray(children).some((child) => React.isValidElement(child) && child.type === DialogTitle) && (
        <DialogTitle asChild>
          <VisuallyHidden>{title}</VisuallyHidden>
        </DialogTitle>
      )}

      <div className="relative z-10">{children}</div>
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-foreground opacity-70 ring-offset-background backdrop-blur-xl transition-all hover:scale-105 hover:bg-white/20 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col space-y-1.5 border-b border-white/10 pb-4 text-center sm:text-left", className)}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse border-t border-white/10 pt-4 sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-submerged", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  VisuallyHidden,
};
