"use client";

import { GroupBreakdown } from "@/components/admin/GroupBreakdown";

export default function SubCategoryPage() {
  return (
    <GroupBreakdown
      title="Sub Category"
      subtitle="Fleet breakdown by fuel type."
      groupBy={(v) => v.fuelType}
      linkParam="fuelType"
    />
  );
}
