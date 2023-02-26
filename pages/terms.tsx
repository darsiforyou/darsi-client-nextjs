import {
  createStyles,
  Text,
  Title,
  TextInput,
  Button,
  Image,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { publicRequest } from "../requestMethods";
// import image from './image.svg';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing.xl * 2,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    border: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
    }`,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: "column-reverse",
      padding: theme.spacing.xl,
    },
  },

  image: {
    maxWidth: "40%",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  body: {
    paddingRight: theme.spacing.xl * 4,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingRight: 0,
      marginTop: theme.spacing.xl,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    marginBottom: theme.spacing.md,
  },

  controls: {
    display: "flex",
    marginTop: theme.spacing.xl,
  },
}));

export default function EmailBanner() {
  const { classes } = useStyles();
  const { data: shipping, isLoading } = useQuery({
    queryKey: ["shipping"],
    queryFn: async () => {
      const res = await publicRequest("/shippings");
      const data = res.data.data[0];
      return data;
    },
  });
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.title}>TERMS AND CONDITIONS</Title>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Introduction </h1>
        </Text>
        <Text size="lg" color="dimmed">
          Welcome to darsi.pk, an online platform for you to purchase
          stationery, general books, and academic course books. On DARSI.pk,
          you&apos;ll find the terms and conditions governing the use of this
          website. By using DARSI.pk, you agree to accept with all these terms.
          If you don’t agree to these terms and conditions, please don’t use
          this website.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Site access and its license </h1>
        </Text>
        <Text size="lg" color="dimmed">
          We try our level best ensure uninterrupted site access, still, it can
          be intruded by certain factors which may not be under our control such
          as the nature of the internet, or may be temporarily halted for
          conservation and updating. The users of DARSI.pk are granted an
          addressable license that provides them the authority to use our site.
          This license will immediately be abandoned without notifying you if
          anyone goes against these terms and conditions if noticed. Under this
          license, you have some limitations for using our site. You must be at
          least 18 years old or using DARSI.pk under supervision. You
          aren&apos;t allowed to download any content from our site, modify it
          or upload any dangerous material on our website. (blasphemous,
          scandalous, stag, unethical, political, unlawful, or religious). This
          license restricts you to transmit any virus to the site or put any
          load on it. Unless explicitly allowed and granted by us, commercial
          use of the site is strictly prohibited.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Data on the site </h1>
        </Text>
        <Text size="lg" color="dimmed">
          We insure that the data or any type of information (product name,
          prices, availability, etc.) present on our site is accurate and true.
          Still, in certain specific circumstances, information may feel to be
          inaccurate due to technical issue or human error. In such a scenario,
          we reserve the right to cancel or modify your order without any
          liability. Also, content on the point is provided only for
          informational purposes and can change from time to time.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Submitted content </h1>
        </Text>
        <Text size="lg" color="dimmed">
          You agree that any content (name, dispatch, comment, review, etc.) you
          post on our site is accurate and true. You shall not use false
          information. You should understand that your submitted content becomes
          our property and shall not be returned to you. We&apos;ve the right to
          edit or modify your content without prior notice.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Electronic communication </h1>
        </Text>
        <Text size="lg" color="dimmed">
          This platform for purchase is an online link that requires an
          electronic medium. By using darsi.pk, you hereby agree to communicate
          with us electronically. You shall give your valid contact name,
          number, and address whenever you place your order and also we may
          respond to you via email or phone.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>RESTRICTION ON TO USE OF TRADEMARKS AND LOGOS: </h1>
        </Text>
        <Text size="lg" color="dimmed">
          All the logos, images, graphics, website design, and content displayed
          on our site are our intellectual property. These are protected by
          copyrights. These trademarks shall not be used in connection with any
          other product that isn&apos;t linked to us. You are strictly forbidden
          to infringe on our intellectual property rights.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>CLAIM OF INTELLECTUAL PROPERTY VIOLATION: </h1>
        </Text>
        <Text size="lg" color="dimmed">
          We take it our responsibility to never infringe on the intellectual
          property rights of others. However, feel free to communicate us, If
          you have any concerns regarding this. You should provide a description
          of the copyrighted material and where it&apos;s located, your name,
          address, contact number, and applicable details. We pledge to try our
          level best to serve you.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>INDEMNITY</h1>
        </Text>
        <Text size="lg" color="dimmed">
          In case of any breach of terms and conditions or violation of laws of
          the Islamic Republic of Pakistan, you agree to indemnify us
          inoffensive from any claims or losses arising out of it.
        </Text>

        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1> Losses from third-party links </h1>
        </Text>
        <Text size="lg" color="dimmed">
          We are not liable for any damages caused by third-party links or ads
          that may be posted on our website.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Delivery Charges</h1>
        </Text>
        <Text size="lg" color="dimmed">
          For Karachi only deliery charges are only{" "}
          {!isLoading && shipping?.inCity} PKR and Nationwide (Pakistan)
          delivery charges are only {!isLoading && shipping?.outCity} PKR for a
          max weight of 1.99 kg. Extra delivery charges will charge in case the
          weight is 2KG or more than 2KG.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>REVISION TO TERMS AND CONDITIONS</h1>
        </Text>
        <Text size="lg" color="dimmed">
          Our terms and conditions can be updated at any time without notifying
          you. If you keep on using our site, you are deemed to agree with our
          terms. If you disagree, notify us so that we can terminate your
          account.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Contact Us </h1>
        </Text>
        <Text size="lg" color="dimmed">
          If you have any questions about this Agreement, please contact us by
          filling out this contact form
          <br />
          Last update: 25-Feb-2023
        </Text>
      </div>
      {/* <Image src={image.src} className={classes.image} /> */}
    </div>
  );
}
