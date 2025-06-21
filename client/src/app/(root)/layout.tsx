import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminPanelLayout>
      <ContentLayout title="">
        {children}
      </ContentLayout>
    </AdminPanelLayout>
  );
};

export default RootLayout;
