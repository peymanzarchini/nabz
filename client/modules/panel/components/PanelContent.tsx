"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { panelLinks } from "@/modules/panel/data";
import { usePanelLogic } from "../hooks/usePanelLogic";
import SidebarDesktop from "./sidebar/SidebarDesktop";
import SidebarOpen from "./sidebar/SidebarOpen";
import Topbar from "./Topbar";
import LogoutBox from "./LogoutBox";

const PanelContent = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    loading,
    logout,
    resolvedTheme,
    setTheme,
    sidebarOpen,
    setSidebarOpen,
    isMenuOpen,
    setIsMenuOpen,
    mounted,
    isLogoutOpen,
    setIsLogoutOpen,
    menuRef,
    unreadCount,
  } = usePanelLogic();

  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">لطفاً ابتدا وارد حساب کاربری خود شوید.</p>
        <Link href="/login">
          <Button>ورود به نبض</Button>
        </Link>
      </div>
    );
  }

  const filteredLinks = panelLinks.filter((link) => link.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
      <SidebarDesktop
        pathname={pathname}
        filteredLinks={filteredLinks}
        unreadCount={unreadCount!}
      />

      <SidebarOpen
        pathname={pathname}
        filteredLinks={filteredLinks}
        unreadCount={unreadCount!}
        setSidebarOpen={setSidebarOpen}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 lg:mr-72 flex flex-col">
        <Topbar
          isMenuOpen={isMenuOpen}
          menuRef={menuRef}
          mounted={mounted}
          user={user}
          resolvedTheme={resolvedTheme!}
          setIsLogoutOpen={setIsLogoutOpen}
          setIsMenuOpen={setIsMenuOpen}
          setSidebarOpen={setSidebarOpen}
          setTheme={setTheme}
        />

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {isLogoutOpen && <LogoutBox logout={logout} setIsLogoutOpen={setIsLogoutOpen} />}
    </div>
  );
};

export default PanelContent;
