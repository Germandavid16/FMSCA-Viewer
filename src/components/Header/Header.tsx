import { AppBar } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const Header = () => {
  return (
    <AppBar
      sx={{ padding: "20px" }}
      position="static"
      color="primary"
      enableColorOnDark
    >
      <Container maxWidth="lg">
        <Typography variant="h6" component="h6">
          FMSCA viewer
        </Typography>
      </Container>
    </AppBar>
  );
};
