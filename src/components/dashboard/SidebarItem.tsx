
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, href, active }: SidebarItemProps) => (
  <Link to={href}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 pl-2 mb-1",
        active ? "bg-primary/10 text-primary" : "hover:bg-primary/5 hover:text-primary"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

export default SidebarItem;
