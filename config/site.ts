import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Beta Rom Writer",
  description:
    "",
  mainNav: [
  ],
  links: {
    github: "https://github.com/AlessioGiacobbe/RomWriterForLogisim",
  },
}
