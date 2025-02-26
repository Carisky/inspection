import React from "react";
import { Box } from "@mui/material";
import {
  Instagram,
  Facebook,
  Telegram,
  WhatsApp,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

interface SocialMediaItem {
  name: string;
  url: string;
  color: string;
  icon: React.ReactElement;
}

const socialMediaList: SocialMediaItem[] = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/tsl_silesia/",
    color: "#E1306C",
    icon: <Instagram />,
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/TSLSilesia",
    color: "#3b5998",
    icon: <Facebook />,
  },
  {
    name: "Telegram",
    url: "http://t.me/WiktoriaKwiatkowska",
    color: "#0088cc",
    icon: <Telegram />,
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/+48608675834",
    color: "#25D366",
    icon: <WhatsApp />,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/104711986/admin/dashboard/",
    color: "#0077B5",
    icon: <LinkedIn />,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@tslsilesia9930",
    color: "#FF0000",
    icon: <YouTube />,
  },
];

const SocialMediaList: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "80px",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
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
