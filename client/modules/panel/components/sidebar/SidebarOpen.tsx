import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { PanelLink } from "../../types";
import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SidebarOpenProps {
  pathname: string;
  filteredLinks: PanelLink[];
  unreadCount: number;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
}

const SidebarOpen = ({
  pathname,
  filteredLinks,
  unreadCount,
  setSidebarOpen,
  isOpen,
}: SidebarOpenProps) => {
  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-300"
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={`relative w-72 bg-white dark:bg-zinc-900 h-full flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-20 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4">
          <div className="flex items-center">
            <Logo width={40} height={40} />
            <span className="text-lg font-black mr-2 text-zinc-800 dark:text-white">داشبورد</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {filteredLinks.map((link) => {
            const isActive = pathname === link.href;
            const isMessagesLink = link.href === "/dashboard/messages";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors relative ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
                {isMessagesLink && unreadCount !== undefined && unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};

export default SidebarOpen;
