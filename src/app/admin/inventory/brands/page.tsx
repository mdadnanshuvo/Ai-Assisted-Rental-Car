"use client";

import { GroupBreakdown } from "@/components/admin/GroupBreakdown";

export default function BrandsPage() {
  return (
    <GroupBreakdown
      title="Brands"
      subtitle="Fleet breakdown by manufacturer."
      groupBy={(v) => v.brand}
      linkParam="brand"
    />
  );
}
