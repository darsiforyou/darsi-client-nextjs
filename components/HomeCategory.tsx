import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  Grid,
  Box,
  Avatar,
  Card,
  Image,
  SimpleGrid,
  Group,
  Center,
} from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  root: {
    marginBottom: 30,
    marginTop: 30,
    backgroundColor: "white",
    padding: 20,
  },
  grid: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderRadius: "0",
    border: `1px solid ${theme.colors.gray[3]}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
      boxShadow: "3px 3px 10px -3px rgba(153,153,153,0.75)",
    },
  },
  imageSection: {
    flex: 3,
    padding: "5px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    flex: 1,
  },
  image: {
    height: "100px !important",
    width: "100%",
    "& img": {
      width: "100%",
      height: "100px !important",
      objectFit: "contain",
    },
  },
  headerContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  seeMoreLink: {
    cursor: "pointer",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export function HomeCategory() {
  const { classes }: any = useStyles();
  const { categories, isFetching } = useSelector(
    (state: any) => state.category
  );
  const [showAll, setShowAll] = useState(false);

  // Filter categories with products > -1
  const filteredCategories = categories.filter(
    (category: any) => category.products > -1
  );

  // Determine how many categories to show initially
  const initialVisibleCount = 8; // 2 columns × 4 rows = 8 items
  const visibleCategories = showAll 
    ? filteredCategories 
    : filteredCategories.slice(0, initialVisibleCount);

  // Check if there are more categories to show
  const hasMoreCategories = filteredCategories.length > initialVisibleCount;

  return (
    <Container size="lg" className={classes.root}>
      <Box className={classes.headerContainer}>
        <Text weight={600} size="xl" sx={{ lineHeight: 1 }}>
          Categories
        </Text>
        
        {hasMoreCategories && !showAll && (
          <Text
            className={classes.seeMoreLink}
            size="xs"
            sx={{ 
              lineHeight: 1, 
              color: "#f85606",
              fontWeight: 500 
            }}
            onClick={() => setShowAll(true)}
          >
            See More{">"}
          </Text>
        )}
        
        {showAll && hasMoreCategories && (
          <Text
            className={classes.seeMoreLink}
            size="xs"
            sx={{ 
              lineHeight: 1, 
              color: "#f85606",
              fontWeight: 500 
            }}
            onClick={() => setShowAll(false)}
          >
            See Less{">"}
          </Text>
        )}
      </Box>
      
      <SimpleGrid
        sx={{ gap: "0px" }}
        breakpoints={[
          { minWidth: 300, cols: 2 },
          { minWidth: "xs", cols: 4 },
          { minWidth: "sm", cols: 6 },
          { minWidth: "md", cols: 8 },
        ]}
        spacing="xs"
      >
        {visibleCategories.map((category: any, i: number) => (
          <Link key={i} href={`/products?category_id=${category._id}`}>
            <Card className={classes.card}>
              <Card.Section className={classes.imageSection}>
                <Image
                  src={category?.imageURL}
                  className={classes.image}
                  alt={category.title}
                />
              </Card.Section>
              <Card.Section className={classes.textSection}>
               
                <Text sx={{ textAlign: "center" }} size="xs">
                  {category.title.length > 30
                    ? category.title.slice(0, 30) + "..."
                    : category.title.slice(0, 30)}
                </Text>
               
              </Card.Section>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </Container>
  );
}