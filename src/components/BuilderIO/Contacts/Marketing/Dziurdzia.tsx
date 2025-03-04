import React from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import pallete from "@/palette";

interface KwiatkowskaProps {
  contacts?: string[];
}

const Dziurdzia: React.FC<KwiatkowskaProps> = ({
  contacts = [
    "Paweł Dziurdzia",
    "Asystent firmy rzeczoznawczo-kontrolnej",
    "kom. +48 32 282 90 62",
    "tel. +48 516 284 653",
    "p.dziurdzia@tsl-silesia.com.pl",
  ],
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {contacts.map((contact, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 24, color: pallete.common_colors.main_color }} />
          <Typography sx={{ fontSize: "18px" }} variant="body1">
            {contact}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Dziurdzia;
