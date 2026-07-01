const AuthLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <h1>Auth Layout</h1>
      {children}
    </div>
  );
};

export default AuthLayout;
