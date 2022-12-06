import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Button,
} from "@mantine/core";
import {
  IconGasStation,
  IconGauge,
  IconManualGearbox,
  IconUsers,
} from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
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
  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: -0.25,
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: 5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

export function PackageCard({ pac }: any) {
  const { classes } = useStyles();

  return (
    <Card withBorder radius="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image src={pac?.imageURL} className={classes.image} alt={pac.title} />
      </Card.Section>

      <Group position="apart" mt="md">
        <div>
          <Text weight={500}>{pac.title}</Text>
          <Text
            size="xs"
            color="dimmed"
            dangerouslySetInnerHTML={{
              __html: pac?.description,
            }}
          ></Text>
        </div>
        {/* <Badge variant="outline">25% off</Badge> */}
      </Group>

      <Card.Section className={classes.section} mt="md">
        <Text size="sm" color="dimmed" className={classes.label}>
          Benefit
        </Text>

        <Group spacing={8}>
          <Text size="xs">Commission: {pac.commission} </Text>
          <Text size="xs">Discount %: {pac.discount_percentage}</Text>
        </Group>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Group spacing={30}>
          <div>
            <Text size="xl" weight={700} sx={{ lineHeight: 1 }}>
              Rs.{pac.price}
            </Text>
            <Text
              size="sm"
              color="dimmed"
              weight={500}
              sx={{ lineHeight: 1 }}
              mt={3}
            >
              / {pac.valid_time} Year
            </Text>
          </div>

          <Button radius="xl" style={{ flex: 1 }}>
            Buy
          </Button>
        </Group>
      </Card.Section>
    </Card>
  );
}
