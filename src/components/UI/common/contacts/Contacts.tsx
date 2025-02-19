import React from "react";
import { Box, Typography } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useLocaleStore } from "@/stores/useLocaleStore";
import pallete from "@/palette";

interface ContactsProps {
  contacts?: {
    ru?: string[];
    en?: string[];
    ua?: string[];
    pl?: string[];
  };
}

const Contacts: React.FC<ContactsProps> = ({ contacts = {} }) => {
  const { locale } = useLocaleStore();
  const contactList = contacts[locale as keyof typeof contacts] || contacts.ru || [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {contactList.map((contact, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle sx={{ fontSize: 24, color: pallete.common_colors.main_color }} />
          <Typography sx={{ fontSize: "20px" }} variant="body1">
            {contact}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Contacts;
