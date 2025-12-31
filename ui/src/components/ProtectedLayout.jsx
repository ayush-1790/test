"use client";

import React, { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Loader from "./Loader";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CustomDataGrid from "./CustomDataGrid";

function LayoutContent({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
    return () => clearTimeout(timeout);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col transition-all duration-300 min-w-0">
        <Navbar />
        <main className="flex-1 overflow-auto bg-text-main min-w-0">
          {React.Children.map(children, (child) => {
            if (child.type === CustomDataGrid) {
              return React.cloneElement(child, {
                sidebarOpen: isSidebarOpen,
              });
            }
            return child;
          })}
        </main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({ children }) {
  const { loading, allowed } = useAuthGuard();

  if (loading) return <Loader />;
  if (!allowed) return null;

  return <LayoutContent>{children}</LayoutContent>;
}
