import Logo from "@/components/ui/Logo";

const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-linear-to-br from-violet-600 via-purple-700 to-teal-500 px-4 py-8">
      <div className="w-full max-w-xl z-10 space-y-5">
        <div className="flex justify-center">
          <Logo width={90} height={90} />
        </div>

        {children}

        <p className="text-center text-white/70 text-xs mt-8">
          © {new Date().getFullYear()} نبض. تمامی حقوق محفوظ است.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
