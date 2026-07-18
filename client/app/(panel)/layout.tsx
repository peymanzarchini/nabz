import { SocketProvider } from "@/lib/providers/SocketProvider";
import PanelContent from "@/modules/panel/components/PanelContent";

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <PanelContent>{children}</PanelContent>
    </SocketProvider>
  );
};

export default DashLayout;
