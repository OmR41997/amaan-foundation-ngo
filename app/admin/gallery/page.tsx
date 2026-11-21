"use client";

import { GalleryTable } from "@/components/admin/gallery/gallery-table";
import { AdminShell } from "@/components/admin/layout/admin-shell";

export default function GalleryPage() {
  return (
    <AdminShell title="Gallery Management">
      <GalleryTable />
    </AdminShell>
  );
}
