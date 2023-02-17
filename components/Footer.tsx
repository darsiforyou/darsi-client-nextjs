import {
  createStyles,
  Text,
  Container,
  ActionIcon,
  Group,
  Grid,
  Anchor,
  Center,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandWhatsapp,
} from "@tabler/icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: 120,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },
  links: {
    [theme.fn.smallerThan("sm")]: {
      // display: "flex",
      // flexDirection: "column",
      // alignItems: "center",
    },
  },
  logo: {
    [theme.fn.smallerThan("sm")]: {
      // display: "flex",
      // flexDirection: "column",
      // alignItems: "center",
    },
  },

  description: {
    marginTop: 8,
    color: "#4d539f",
    fontWeight: 700,
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,

      fontWeight: "bolder",
      // textAlign: "center",
    },
  },
  link: {
    display: "flex",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    paddingTop: 3,
    paddingBottom: 3,

    "&:hover": {
      textDecoration: "underline",
    },
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 700,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xs / 2,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
  },
  mycontact: {
    color: "#000",
    fontSize: theme.fontSizes.lg,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    // textAlign: "center",
    fontWeight: "bold",
    //  marginLeft: theme.spacing.lg / 2,
    // paddingLeft: "10%",
  },
  ulitem: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    fontSize: theme.fontSizes.sm,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    listStyleType: "none",
  },
  liitems: {
    paddingTop: 3,
    marginTop: 3,
  },
  afterFooter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
    },
  },

  social: {
    [theme.fn.smallerThan("sm")]: {
      marginTop: theme.spacing.xs,
    },
  },
}));

interface FooterLinksProps {
  links: any[];
}

export function FooterLinks({ links }: FooterLinksProps) {
  const { classes } = useStyles();
  const { categories, isFetching } = useSelector(
    (state: any) => state.category
  );
  const [footerCategories, setFooterCategories] = useState([]);
  useEffect(() => {
    let cats = categories.map((category: any) => ({
      label: category.title,
      link: `/products?category_id=${category._id}`,
    }));
    setFooterCategories(cats);
  }, [isFetching]);

  return (
    <footer className={classes.footer}>
      <Container size="lg">
        <Grid columns={24} justify="center">
          <Grid.Col md={12} xs={24} className={classes.logo}>
            <Image
              src={"/darsi-logo.png"}
              alt="Logo"
              width={100}
              height={100}
            />
            <Text size="xs" className={classes.description}>
              DON{"`"}T COMPROMISE ON QUALITY OF EDUCATION. <br></br>CONSULT US
              FOR PUBLICATIONS
            </Text>
            <Group
              spacing={0}
              className={classes.social}
              position="left"
              mt="xl"
              noWrap
            >
              <ActionIcon
                component="a"
                href="https://www.facebook.com/profile.php?id=100090313983035&mibextid=ZbWKwL"
                size="xl"
              >
                <IconBrandFacebook size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="xl">
                <IconBrandYoutube size={18} stroke={1.5} />
              </ActionIcon>
              <ActionIcon size="xl">
                <IconBrandInstagram size={18} stroke={1.5} />
              </ActionIcon>
            </Group>
          </Grid.Col>
          <Grid.Col md={4} xs={24} className={classes.links}>
            <Text className={classes.title}>Pages</Text>
            {links.map((link: any, index) => (
              <Link href={link.link} key={index} className={classes.link}>
                {link.label}
              </Link>
            ))}
          </Grid.Col>
          <Grid.Col md={4} xs={24} className={classes.links}>
            <Text className={classes.title}>Categories</Text>
            {footerCategories.slice(0, 5).map((link: any, index) => (
              <Link href={link.link} key={index} className={classes.link}>
                {link.label}
              </Link>
            ))}
          </Grid.Col>
          <Grid.Col md={4} xs={24} className={classes.links}>
            <Text className={classes.title}>Contact Us</Text>
            {/* {footerCategories.slice(0, 5).map((link: any, index) => (
              <Link href={link.link} key={index} className={classes.link}>
                {link.label}
              </Link>
            ))} */}
            <a className={classes.link}>Sales : sale@darsi.pk</a>
            <a className={classes.link}>Support: support@darsi.pk</a>
            <a className={classes.link}>Query: info@darsi.pk</a>
            <a className={classes.link}><IconBrandWhatsapp size={20} stroke={2} style={{display: "inlineFlex"}}/> &nbsp;  +92 300 0206761
            </a>
          </Grid.Col>
        </Grid>
      </Container>
      <Container size="lg" className={classes.afterFooter}>
        <Center>
          <Text color="dimmed" align="center" size="sm">
            © 2023 Darsi.pk All rights reserved.
          </Text>
        </Center>
      </Container>
    </footer>
  );
}
