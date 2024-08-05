import { AppBar } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const Header = () => {
  return (
    <AppBar
      sx={{ padding: "20px" }}
      position="fixed"
      color="primary"
      enableColorOnDark
    >
      <Box sx={{ maxWidth: "1920px" }}>
        <Typography variant="h6" component="h6">
          FMSCA viewer
        </Typography>
      </Box>
    </AppBar>
  );
};
