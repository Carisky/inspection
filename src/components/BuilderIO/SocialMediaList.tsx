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
import { motion } from "framer-motion";

const socialMediaList = [
  { name: "Instagram", url: "https://www.instagram.com/tsl_silesia/", color: "#E1306C", icon: <Instagram /> },
  { name: "Facebook", url: "https://www.facebook.com/TSLSilesia", color: "#3b5998", icon: <Facebook /> },
  { name: "Telegram", url: "http://t.me/WiktoriaKwiatkowska", color: "#0088cc", icon: <Telegram /> },
  { name: "WhatsApp", url: "https://wa.me/+48608675834", color: "#25D366", icon: <WhatsApp /> },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/104711986/admin/dashboard/", color: "#0077B5", icon: <LinkedIn /> },
  { name: "YouTube", url: "https://www.youtube.com/@tslsilesia9930", color: "#FF0000", icon: <YouTube /> },
];

const SocialMediaList = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        maxWidth: 300,
        mx: "auto",
        "@media (max-width: 600px)": {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(2, auto)",
          gap: 2,
        },
      }}
    >
      {socialMediaList.map((social, index) => (
        <motion.div
          key={social.name}
          initial={{ y: index % 2 === 0 ? 30 : -30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Box
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
        </motion.div>
      ))}
    </Box>
  );
};

export default SocialMediaList;
