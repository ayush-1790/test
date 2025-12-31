"use client";

import ProtectedLayout from "@/components/ProtectedLayout";

export default function PrivateLayout({ children }) {
  return (
    <ProtectedLayout>
      <div className="w-full overflow-x-hidden h-auto">{children}</div>
    </ProtectedLayout>
  );
}
