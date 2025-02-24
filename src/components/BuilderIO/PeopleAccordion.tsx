import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import BusinessIcon from "@mui/icons-material/Business";
import Typography from "@mui/material/Typography";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import { useLocaleStore } from "@/stores/useLocaleStore";
import pallete from "@/palette";

export interface Person {
  firstName: string;
  lastName: string;
  photo: string;
  positionTranslations: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
  tl?: string;
  email?: string;
  tlWew?: string;
}

export interface PeopleAccordionProps {
  // Пропсы теперь опциональны – если их не передать, будут использоваться значения по умолчанию
  headerTranslations?: {
    ru?: string;
    en?: string;
    ua?: string;
    pl?: string;
  };
  people?: Person[];
}

const PeopleAccordion: React.FC<PeopleAccordionProps> = ({
  headerTranslations,
  people,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { locale } = useLocaleStore();

  // Значения по умолчанию для заголовка
  const defaultHeaderTranslations = {
    ru: "Сотрудники",
    en: "Team Members",
    ua: "Співробітники",
    pl: "Pracownicy",
  };

  const mergedHeaderTranslations = {
    ...defaultHeaderTranslations,
    ...headerTranslations,
  };

  const headerText =
    mergedHeaderTranslations[locale as keyof typeof mergedHeaderTranslations] ||
    mergedHeaderTranslations.ru;

  // Значения по умолчанию для должности
  const defaultPositionTranslations = {
    ru: "Должность",
    en: "Position",
    ua: "Посада",
    pl: "Stanowisko",
  };

  // Пример дефолтных данных для сотрудников
  const defaultPeople: Person[] = [
    {
      firstName: "John",
      lastName: "Doe",
      photo: "https://via.placeholder.com/200",
      positionTranslations: {
        ru: "Должность",
        en: "Position",
        ua: "Посада",
        pl: "Stanowisko",
      },
      tl: "+7 (111) 111-11-11",
      email: "john.doe@example.com",
      tlWew: "Дополнительная информация",
    },
    // Можно добавить дополнительные записи...
  ];

  const peopleData = people && people.length ? people : defaultPeople;

  return (
    <Accordion
      sx={{
        width: "90%",
        margin: "auto",
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BusinessIcon
            sx={{
              color: pallete.common_colors.main_color,
              marginRight: "10px",
            }}
          />
          <Typography
            sx={{ fontSize: "30px", color: pallete.common_colors.main_color }}
            variant="h2"
            component="h2"
            align="center"
          >
            {headerText}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {peopleData.map((person, index) => {
            const mergedPositionTranslations = {
              ...defaultPositionTranslations,
              ...person.positionTranslations,
            };
            const positionText =
              mergedPositionTranslations[
                locale as keyof typeof mergedPositionTranslations
              ] || mergedPositionTranslations.ru;

            return (
              <Grid key={index} item xs={12} sm={6}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: isMobile ? "column" : "row",
                    textAlign: isMobile ? "center" : "left",
                    gap: "20px",
                  }}
                >
                  <img
                    src={person.photo}
                    alt={`${person.firstName} ${person.lastName}`}
                    width={200}
                    height={200} // Ensure the image is properly sized
                    style={{
                      borderRadius: "5%",
                      marginRight: 8,
                    }}
                  />
                  <div>
                    <Typography variant="h6">
                      {person.firstName} {person.lastName}
                    </Typography>
                    <Typography variant="body2">{positionText}</Typography>
                    {/* Дополнительные контактные данные */}
                    {person.tl && (
                      <Typography variant="body2">Kom: {person.tl}</Typography>
                    )}
                    {person.email && (
                      <Typography variant="body2">
                        Email: {person.email}
                      </Typography>
                    )}
                    {person.tlWew && (
                      <Typography variant="body2">
                        tl.wew: {person.tlWew}
                      </Typography>
                    )}
                  </div>
                </div>
              </Grid>
            );
          })}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default PeopleAccordion;
