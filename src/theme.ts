import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#673AB7',
      dark: '#512DA8',
      light: '#D1C4E9',
    },
    secondary: {
      main: '#536DFE',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#757575',
    },
    divider: '#BDBDBD',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242', // фиксированный фон, чтобы не было белых полей
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575', // базовый цвет рамки
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575', // при наведении не меняем рамку на белую
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1C4E9', // при фокусе используем светлый вариант
          },
          color: '#FFFFFF', // цвет вводимого текста
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#757575',
          '&.Mui-focused': {
            color: '#D1C4E9',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#424242', // устанавливаем фон для селекта
          color: '#FFFFFF',           // текст белый
          '&:hover': {
            backgroundColor: '#424242', // не меняем фон при наведении
          },
        },
      },
    },
  },
});

export default theme;
