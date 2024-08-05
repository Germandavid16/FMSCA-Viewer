import Box from "@mui/material/Box";

import EnhancedTable from "../Table/Table";
import { Header } from "../Header/Header";

export default function App() {
  return (
    <>
      <Header />
      <Box sx={{ padding: "50px 20px", maxWidth: "1920px" }}>
        <EnhancedTable />
      </Box>
    </>
  );
}
