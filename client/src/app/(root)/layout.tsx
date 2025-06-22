import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
};

export default RootLayout;
