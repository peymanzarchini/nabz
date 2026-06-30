const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <h1>Main Page</h1>
      {children}
    </div>
  );
};

export default MainLayout;
