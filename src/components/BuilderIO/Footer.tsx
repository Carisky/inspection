import React from "react";
import { Grid, Typography, Box } from "@mui/material";

// Импортируем необходимые иконки
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import InfoIcon from "@mui/icons-material/Info";
import pallete from "@/palette";

const Footer = () => {
  const textSx ={color:pallete.common_colors.accent, fontWeight:600}
  const iconSx ={color:pallete.common_colors.main_color}
  return (
    <Box component="footer" sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
      <Grid container spacing={2}>
        {/* Первый столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <BusinessIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              TSL Silesia Sp. z o.o.
            </Typography>
          </Box>
        </Grid>

        {/* Второй столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ mr: 1, ...iconSx }} />
            <Typography  sx={textSx} variant="body2">
              ul. Rycerska 9<br />
              41-902 Bytom Śląskie, Polska
            </Typography>
          </Box>
        </Grid>

        {/* Третий столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              +48 32 282 90 62<br />
              +48 32 281 34 02
            </Typography>
          </Box>
        </Grid>

        {/* Четвертый столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              office@tsl-silesia.com.pl
            </Typography>
          </Box>
        </Grid>

        {/* Пятый столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <DescriptionIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              KRS: 0000178847 - VIII Wydz. Gosp. w. Katowicach
            </Typography>
          </Box>
        </Grid>

        {/* Шестой столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <AccountBalanceIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              Kapitał zakładowy: 50 000 PLN
            </Typography>
          </Box>
        </Grid>

        {/* Седьмой столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <AssignmentIndIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              NIP: PL6262721695
            </Typography>
          </Box>
        </Grid>

        {/* Восьмой столбец */}
        <Grid item xs={12} md={3}>
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ mr: 1, ...iconSx }} />
            <Typography sx={textSx} variant="body2">
              Regon: 278125418
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
