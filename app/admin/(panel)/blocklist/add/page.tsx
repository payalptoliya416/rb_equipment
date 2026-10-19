import { Suspense } from "react";
import AddBlocklistClient from "@/adminpanel/AddBlocklistClient";

export default function BlocklistAddPage() {
  return (
    <Suspense fallback={null}>
      <AddBlocklistClient />
    </Suspense>
  );
}
