import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  LoadingOverlay,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { get_banner_content } from "../redux/action/dashboard";
import image from "./image.svg";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
      textAlign: "center",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    backgroundColor: "#f85606",
    "&:hover": {
      backgroundColor: "#f85606",
      transform: "scale(1.1)",
    },
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: "4px 12px",
  },
}));

export function Banner() {
  const [loader, setloader] = useState(true);
  const [content, setcontent]: any = useState({});

  useEffect(() => {
    get_banner_content().then(({ data }: any) => {
      setcontent(data.data[0]);
      setloader(false);
    });
  }, []);
  const { classes } = useStyles();

  return (
    <Container size="lg">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>{content.title}</Title>
          <Text color="dimmed" mt="md">
            {content.sub_title}
          </Text>
          <Text
            color="dimmed"
            mt="md"
            dangerouslySetInnerHTML={{
              __html: content?.description,
            }}
          ></Text>
          <Group mt={30}>
            <Button
              size="md"
              className={classes.control}
              component={Link}
              href="/products"
            >
              Shop Now
            </Button>
          </Group>
        </div>
        <Image src={content?.imageURL} className={classes.image} />
      </div>
      <LoadingOverlay visible={loader} overlayBlur={2} />
    </Container>
  );
}
