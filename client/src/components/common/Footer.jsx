import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import Container from "./Container";
import Logo from "./Logo";
import React from "react";
import menuConfigs from "../../configs/menu.configs";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Container>
      <Paper square={true} sx={{ backgroundImage: "unset", padding: "2rem" }}>
        <Stack
          alignItems="center"
          justifyContent="space-between"
          direction={{ xs: "column", md: "row" }}
          sx={{ height: "max-content" }}
        >
          <Logo />
          <Box>
            {menuConfigs.main.map((item, index) => (
              <Button
                key={index}
                sx={{ color: "inherit" }}
                component={Link}
                to={item.path}
              >
                {item.display}
              </Button>
            ))}
          </Box>
        </Stack>
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            paddingTop: "1rem",
            color: "rgb(255,255,255)",
            fontSize: "1.125rem",
            fontWeight: "600",
          }}
        >
          Made with ❤️ by
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/noobmaster432"
            style={{ textDecoration: "none", color: "#ff0000" }}
          >
            {" "}
            Noobmaster
          </a>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Footer;
