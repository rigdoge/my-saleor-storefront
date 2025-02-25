import { Loader2, LucideProps, Moon, SunMedium, Twitter, LucideIcon, Mail, Lock, Facebook, } from "lucide-react"
import { FcGoogle } from "react-icons/fc"

export type Icon = LucideIcon

export const Icons = {
  sun: SunMedium,
  moon: Moon,
  twitter: Twitter,
  spinner: Loader2,
  mail: Mail,
  lock: Lock,
  facebook: Facebook,
  google: FcGoogle,
} as const
