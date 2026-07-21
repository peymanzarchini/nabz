"use client";

import { useState } from "react";
import Logo from "@/components/ui/Logo";
import { Menu, X } from "lucide-react";
import { useCategories } from "@/modules/home/hooks/useGetCategories";
import { useAuth } from "@/lib/providers/AuthProvider";
import MegaMenu from "./MegaMenu";
import SearchWithPreview from "./SearchWithPreview";
import ThemeToggle from "./ThemeToggle";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const { data: categories, isLoading } = useCategories();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-1000 w-full bg-background/70 backdrop-blur-xl border-b border-border/30 dark:border-white/30 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex shrink-0">
          <Logo width={70} height={70} />
        </div>

        <div className="hidden md:flex flex-1 items-center gap-4 h-12 mx-4">
          <MegaMenu categories={categories} isLoading={isLoading} />
          <SearchWithPreview />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButtons user={user} loading={loading} logout={logout} />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 rounded-xl border border-border/30 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm text-foreground hover:bg-secondary transition-all duration-200 cursor-pointer"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        isLoading={isLoading}
        user={user}
        loading={loading}
        logout={logout}
      />
    </header>
  );
};

export default Header;
