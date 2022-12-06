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
} from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";

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
  // card: {
  //   backgroundColor:
  //     theme.colorScheme === "dark"
  //       ? theme.colors.dark[6]
  //       : theme.colors.gray[0],
  //   padding: "10px",
  //   borderRadius: "30px",
  //   cursor: "pointer",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   "&:hover": {
  //     boxShadow: "6px 6px 11px -3px rgba(153,153,153,0.75)",
  //     backgroundColor:
  //       theme.colorScheme === "dark"
  //         ? theme.colors.dark[5]
  //         : theme.colors.gray[1],
  //   },
  //   "& span": {
  //     display: "flex",
  //     alignItems: "center",
  //     avatar: {
  //       height: "auto",
  //     },
  //   },
  // },
  card: {
    // backgroundColor:
    //   theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
    // height: 250,
    borderRadius: "0",
    border: `1px solid ${theme.colors.gray[3]}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
      boxShadow: "3px 3px 10px -3px rgba(153,153,153,0.75)",
    },
    // '@media (min-width: 755px)': {
    //   backgroundColor:
    //     theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
    // }
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
}));

export function HomeCategory() {
  const { classes }: any = useStyles();
  const { categories, isFetching } = useSelector(
    (state: any) => state.category
  );
  return (
    <Container size="lg" className={classes.root}>
      <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
        Categories
      </Text>
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
        {categories.map((category: any, i: number) =>
          category.products > 0 ? (
            <Link key={i} href={`/products?category_id=${category._id}`}>
              {/* <Box className={classes.card}>
              <span>
                <Avatar
                  radius="xl"
                  className={classes.avatar}
                  src={category?.imageURL}
                  alt={category.title}
                />
                <span style={{ paddingLeft: 10, textTransform: "capitalize" }}>
                  {category.title}
                </span>
              </span>
            </Box> */}
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
                    {/* {`${category.title.slice(0, 30)}${
                    category.title.length > 30 && "..."}`} */}
                    {category.title.length > 30
                      ? category.title.slice(0, 30) + "..."
                      : category.title.slice(0, 30)}
                  </Text>
                </Card.Section>
              </Card>
            </Link>
          ) : null
        )}
      </SimpleGrid>
    </Container>
  );
}
