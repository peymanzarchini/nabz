import Logo from "@/components/ui/Logo";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 px-4 py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-xl z-10 space-y-5">
        <div className="flex justify-center">
          <Logo width={90} height={90} />
        </div>

        {children}

        <p className="text-center text-zinc-400 dark:text-zinc-500 text-xs mt-8">
          8 © {new Date().getFullYear()} نبض. تمامی حقوق محفوظ است.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
