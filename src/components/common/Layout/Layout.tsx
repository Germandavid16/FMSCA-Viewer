import { FC, ReactNode } from "react";

import Box from "@mui/material/Box";

import { Header } from "../Header/Header";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        <Box sx={{ padding: "50px 20px", maxWidth: "1920px" }}>{children}</Box>
      </main>
    </>
  );
};
