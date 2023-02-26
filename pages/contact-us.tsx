import {
  createStyles,
  Text,
  Title,
  SimpleGrid,
  TextInput,
  Textarea,
  Button,
  Group,
  ActionIcon,
  Container,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandInstagram,
} from "@tabler/icons";
import { ContactIconsList } from "../components/ContactIcons";
//  import { useForm, ValidationError } from "@formspree/react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 400,
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(-60deg, #f85606 0%, #f85606 100%)`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 2.5,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1.5,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: "white",
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  social: {
    color: theme.white,

    "&:hover": {
      color: "#4d539f",
    },
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    "&::placeholder": {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  control: {
    backgroundColor: "#f85606",
  },
}));

const social = [IconBrandFacebook, IconBrandYoutube, IconBrandInstagram];


export default function ContactUs() {
  const { classes } = useStyles();
  // const [state, handleSubmit] = useForm("https://formspree.io/f/xoqzdrwr");
  // if (state.succeeded) {
  //     return <p>Thanks for joining!</p>;
  // }
  
  const icons = social.map((Icon, index) => (
    <ActionIcon
      key={index}
      size={28}
      className={classes.social}
      variant="transparent"
    >
      <Icon size={22} stroke={1.5} />
    </ActionIcon>
  ));
  

  return (
    <form action="https://formspree.io/f/xoqzdrwr" method="POST">
    <Container mt={60}>
      <div className={classes.wrapper}>
        <SimpleGrid
          cols={2}
          spacing={50}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <div>
            <Title className={classes.title}>Contact us</Title>
            <Text className={classes.description} mt="sm" mb={30}>
              Leave your email and we will get back to you within 24 hours
            </Text>

            <ContactIconsList variant="white" />

            <Group mt="xl">{icons}</Group>
          </div>
          <div className={classes.form}>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              name ="email"
              required
              classNames={{ input: classes.input, label: classes.inputLabel }}
            />
            {/* <ValidationError prefix="email" field="email" errors={state.errors} /> */}
            <TextInput
              label="Name"
              placeholder="Fazian Dilshad"
              name="name"
              mt="md"
              classNames={{ input: classes.input, label: classes.inputLabel }}
            />
            {/* <ValidationError prefix="name" field="name" errors={state.errors} /> */}
            <Textarea
              required
              label="Your message"
              name="your-message"
              placeholder="I want to order your goods"
              minRows={4}
              mt="md"
              classNames={{ input: classes.input, label: classes.inputLabel }}
            />
            {/* <ValidationError prefix="your-message" field="your-message" errors={state.errors} /> */}

            <Group position="right" mt="md">
            <Button className={classes.control} type="submit">Send message</Button>
              {/* <Button className={classes.control} disabled={state.submitting} type="submit">Send message</Button>
              <ValidationError errors={state.errors} /> */}
            </Group>
          </div>
        </SimpleGrid>
      </div>
    </Container>
    </form>
  );
}
