import pallete from '@/palette';
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <Box
      sx={{
        width: '100%',
      }}
    >
      <Divider sx={{ backgroundColor: '#01aaa0' }} />
      <Typography
        variant="h2"
        sx={{
          color: pallete.common_colors.main_color,
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 600,
          height:"50px",
          alignContent:"center"
        }}
      >
        {text}
      </Typography>
      <Divider sx={{ backgroundColor: '#01aaa0' }} />
    </Box>
  );
};

export default Title;
