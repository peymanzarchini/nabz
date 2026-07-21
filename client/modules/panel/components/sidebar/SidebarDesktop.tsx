import Logo from "@/components/ui/Logo";
import Link from "next/link";
import { PanelLink } from "../../types";

interface SidebarDesktopProps {
  pathname: string;
  filteredLinks: PanelLink[];
  unreadCount: number;
}

const SidebarDesktop = ({ pathname, filteredLinks, unreadCount }: SidebarDesktopProps) => {
  return (
    <aside className="hidden lg:flex w-72 flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 fixed inset-y-0 right-0 z-50">
      <div className="h-20 flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
        <Logo width={50} height={50} />
        <span className="text-xl font-black mr-2 text-zinc-800 dark:text-white">داشبورد نبض</span>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
          const isMessagesLink = link.href === "/dashboard/messages";
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-colors relative ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
              {isMessagesLink && unreadCount !== undefined && unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarDesktop;
