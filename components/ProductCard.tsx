import {
  Card,
  Text,
  createStyles,
  ActionIcon,
  Box,
  Badge,
  Center,
} from "@mantine/core";
import { IconShoppingCart } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/reducers/cartRedux";

import Image from "next/image";

const useStyles = createStyles((theme) => ({
  card: {
    height: "100%",
    // padding: "8px !important",
    // borderRadius: "0",
    display: "flex",
    flexDirection: "column",

    justifyContent: "space-between",
    transition: ".2s",
    "&:hover": {
      transform: "scale(1.1)",
      zIndex: 2,
      boxShadow: "3px 3px 11px -3px rgba(153,153,153,0.75)",
    },
    "@media (max-width: 576px)": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[1],
    },
  },
  image: {
    // height: "100px !important",
    width: "100%",
    objectFit: "contain",
    "& img": {
      width: "100%",
      height: "100px !important",
      // "object-fit": "contain !important",
      objectFit: "contain",
    },
  },
}));

export function ProductCard({ product }: any) {
  const { classes }: any = useStyles();
  const dispatch = useDispatch();
  const rendertag = () => {
    let tags = (product.tags || "").replace(/\s/g, "").split(",");
    if (tags.length <= 0 || tags[0] === "") return null;
    return tags.slice(0, 3).map((tag: string, i: number) => (
      <Badge
        key={i}
        size="xs"
        variant="filled"
        sx={{ marginLeft: 2, background: "#f85606", color: "white" }}
      >
        {tag}
      </Badge>
    ));
  };
  const renderImage = () => {
    let frontImage = (product.media || []).find((x: any) => x.isFront === true);
    return frontImage && frontImage?.imageURL;
  };

  return (
    <Link href={`/product/${product._id}`}>
      <Card shadow="sm" radius="md" className={classes.card} withBorder>
        <Card.Section
          style={{
            backgroundColor: "rgba(255,255,255,0.5)",
            backdropFilter: "blur(2px)",
          }}
        >
          <Center>
            <Box sx={{ position: "relative" }}>
              <Image
                // src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                height={160}
                width={200}
                src={renderImage()}
                style={{ objectFit: "contain" }}
                alt="Norway"
              />
            </Box>
          </Center>
        </Card.Section>

        {/* <Group position="apart" mt="md" mb="xs">
          <Text weight={500}>Norway Fjord Adventures</Text>
          <Badge color="pink" variant="light">
            On Sale
          </Badge>
        </Group> */}
        <Card.Section
          p={"md"}
          style={{ backgroundColor: "#fff", position: "relative" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text
              size="sm"
              my={"md"}
              sx={{
                // position: "absolute",
                overflowWrap: "break-word",
                wordWrap: "break-word",
                hyphens: "auto",
                whiteSpace: "normal",
                textAlign: "center",
              }}
            >
              {`${product.title.slice(0, 30)}${
                product.title.length > 30 ? "..." : ""
              }`}
            </Text>
            <Text size="md" sx={{ lineHeight: 1, color: "#f85606" }}>
              Rs.{product.price}
            </Text>
          </Box>
        </Card.Section>
        {/* <Text size="sm" color="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
          with tours and activities on and around the fjords of Norway
        </Text>
        <Text size="sm" color="dimmed">
          With Fjord Tours you can explore more of the magical fjord landscapes
          with tours and activities on and around the fjords of Norway
        </Text> */}

        {/* <Button variant="light" color="blue" fullWidth mt="md" radius="md">
          Book classic tour now
        </Button> */}
      </Card>
      {/* <Card className={classes.card}>
        <Box sx={{ width: "189px", height: "189px", position: "relative" }}>
          <img
            src={renderImage()}
            // className={classes.image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              position: "absolute",
              transform: "translate(-50%,50%)",
            }}
            alt={product.title}
            //  withPlaceholder
          />
        </Box>
        <Box>
          <Text size="md" sx={{ marginBottom: 5 }}>
            {`${product.title.slice(0, 30)}${
              product.title.length > 30 ? "..." : ""
            }`}
          </Text>
          <Text size="lg" sx={{ lineHeight: 1, color: "#f85606" }}>
            Rs.{product.price}
          </Text>
        </Box>
      </Card> */}
    </Link>
  );
}
