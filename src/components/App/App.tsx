import Container from "@mui/material/Container";

import EnhancedTable from "../Table/Table";
import { Header } from "../Header/Header";

export default function App() {
  return (
    <>
      <Header />
      <Container sx={{ padding: "50px 0" }} maxWidth="lg">
        <EnhancedTable />
      </Container>
    </>
  );
}
