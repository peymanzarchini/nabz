import ListingsContent from "@/modules/home/components/listings/ListingsContent";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

const ListingsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 pb-16 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
};

export default ListingsPage;
