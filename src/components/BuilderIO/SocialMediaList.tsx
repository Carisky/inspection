import React from "react";
import { Box } from "@mui/material";
import { Telegram, WhatsApp } from "@mui/icons-material";

interface SocialMediaItem {
  name: string;
  url: string;
  color: string;
  icon: React.ReactElement;
}

const socialMediaList: SocialMediaItem[] = [
  { name: "Telegram", url: "https://t.me", color: "#0088cc", icon: <Telegram /> },
  { name: "WhatsApp", url: "https://wa.me", color: "#25D366", icon: <WhatsApp /> },
];

const SocialMediaList: React.FC = () => {
  return (
    <Box sx={{ display: "flex", justifyContent:"center", gap: 2 }}>
      {socialMediaList.map((social) => (
        <Box
          key={social.name}
          component="a"
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10%",
            backgroundColor: social.color,
            color: "#fff",
            textDecoration: "none",
            transition: "0.3s",
            "&:hover": { opacity: 0.8 },
          }}
        >
          {social.icon}
        </Box>
      ))}
    </Box>
  );
};

export default SocialMediaList;
