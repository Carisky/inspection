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
      default: '#303030', // Фон для body
      paper: '#424242',   // Фон для компонентов Paper, Drawer и т.п.
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#757575',
    },
    divider: '#BDBDBD',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#303030 !important',
          color: '#FFFFFF',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#424242 !important', // фиксированный фон для поля
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575 !important', // базовый цвет рамки
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#757575 !important', // при наведении
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D1C4E9 !important', // при фокусе
          },
          color: '#FFFFFF !important', // цвет вводимого текста
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#757575 !important',
          '&.Mui-focused': {
            color: '#D1C4E9 !important',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#424242 !important',
          color: '#FFFFFF !important',
          '&:hover': {
            backgroundColor: '#424242 !important',
          },
        },
      },
    },
  },
});

export default theme;
