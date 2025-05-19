
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className={
              variant === "destructive" 
                ? "border-red-500 bg-red-50 text-red-900" 
                : variant === "success"
                  ? "border-green-500 bg-green-50 text-green-900"
                  : ""
            }
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle 
                  className={
                    variant === "destructive" 
                      ? "text-red-900 font-bold" 
                      : variant === "success" 
                        ? "text-green-900 font-bold" 
                        : ""
                  }
                >
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription 
                  className={
                    variant === "destructive" 
                      ? "text-red-800" 
                      : variant === "success" 
                        ? "text-green-800" 
                        : ""
                  }
                >
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
