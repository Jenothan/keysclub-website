"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import CircleCheckIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import TriangleAlertIcon from '@mui/icons-material/Warning';
import OctagonXIcon from '@mui/icons-material/DoNotDisturbOn';
import Loader2Icon from '@mui/icons-material/Autorenew';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      closeButton
      position="top-right"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
        ),
        info: (
          <InfoIcon className="w-5 h-5 text-blue-600 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="w-5 h-5 text-amber-600 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="w-5 h-5 text-red-600 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="w-5 h-5 text-yellow-600 animate-spin shrink-0" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group toast font-sans text-xs sm:text-sm font-extrabold rounded-2xl p-4 flex items-center gap-3 border shadow-lg transition-all",
          success: "!bg-emerald-50 !text-emerald-950 !border-emerald-300 [&_svg]:!text-emerald-600",
          error: "!bg-red-50 !text-red-950 !border-red-300 [&_svg]:!text-red-600",
          warning: "!bg-amber-50 !text-amber-950 !border-amber-300 [&_svg]:!text-amber-600",
          info: "!bg-blue-50 !text-blue-950 !border-blue-300 [&_svg]:!text-blue-600",
          description: "text-slate-500 font-medium text-xs",
          actionButton: "!bg-slate-900 !text-white font-bold rounded-xl",
          cancelButton: "!bg-slate-100 !text-slate-700 font-bold rounded-xl",
          closeButton: "!bg-slate-200/60 hover:!bg-slate-300/80 !text-slate-700 !border-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
