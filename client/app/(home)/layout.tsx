import Footer from "@/modules/home/components/Footer";
import Header from "@/modules/home/components/Header";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
