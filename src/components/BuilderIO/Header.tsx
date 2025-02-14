import { Box } from "@mui/material";
import React from "react";
import pallete from "@/palette";
import Image from "next/image";
import Page from "@/interfaces/Page";

const Header = ({ pages = [] }: { pages: Page[] }) => {
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: pallete.common_colors.main_color,
          width: "100vw",
          height: "3vh",
        }}
      ></Box>
      <Box
        sx={{
          width: "100vw",
          backgroundColor: pallete.common_colors.background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "2%",
          paddingBottom: "2%",
        }}
      >
        <Box
          sx={{
            width: "80vw",
            height: "100%",
            display: "flex",
          }}
        >
          <Box>
            <Image
              src="/images/assets/nav/cropped-logo-z-napisem-z-R_przez.png"
              alt="Company Logo"
              width={200} 
              height={200} 
              priority 
            />
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(2, auto)",
              gap: 2,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              ul. Rycerska 9, 41-902 Bytom
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              +48 (32) 282 90 62
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              +48 (32) 281 34 02
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              office@tsl-group.pl
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "7vh",
          backgroundColor: pallete.common_colors.main_color,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            display: "flex",
            backgroundColor: pallete.elements.nav,
            height: "10vh",
            width: "80vw",
            margin: "auto",
            top: "3vh",
            left: "10%",
            zIndex:10,
          }}
        >
          {pages.length > 0 ? (
            pages.map((page) => (
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: pallete.common_colors.white,
                  ":hover": {
                    backgroundColor: pallete.elements.nav_element_hover,
                    transition: "ease-in",
                  },
                }}
                key={page.data.url}
              >
                <a href={page.data.url}>{page.data.title}</a>
              </Box>
            ))
          ) : (
            <li>Loading...</li>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
