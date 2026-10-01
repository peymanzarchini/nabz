import Logo from "@/components/ui/Logo";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background to-muted/30"></div>

      <div className="absolute top-[-10%] right-[-10%] w-160 h-160 rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-160 h-160 rounded-full bg-accent/10 dark:bg-accent/20 blur-[120px] -z-10 animate-pulse-slow"></div>

      <div
        className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="w-full max-w-xl z-10 space-y-5">
        <div className="flex justify-center mb-2">
          <Logo width={90} height={90} />
        </div>

        {children}

        <p className="text-center text-muted-foreground text-xs mt-8">
          © {new Date().getFullYear()} نبض. تمامی حقوق محفوظ است.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
