"use client";

import { GroupBreakdown } from "@/components/admin/GroupBreakdown";

export default function CategoryPage() {
  return (
    <GroupBreakdown
      title="Category"
      subtitle="Fleet breakdown by vehicle category."
      groupBy={(v) => v.type}
      linkParam="type"
    />
  );
}
