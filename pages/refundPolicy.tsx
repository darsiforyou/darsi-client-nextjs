import {
  createStyles,
  Text,
  Title,
  TextInput,
  Button,
  Image,
} from "@mantine/core";
import {
    
    IconBrandWhatsapp,
    IconMail,
  } from "@tabler/icons";
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
  titles: {
    color:"#f85606",
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
  return (
    <div className={classes.wrapper}>
      <div className={classes.body}>
        <Title className={classes.titles}>
        RETURN, EXCHANGE, AND REFUND POLICY
        </Title>

        <Text size="lg" color="dimmed">
        DARSI.pk return and refund policy last 15 days (except toys), If 15 days have passed since your purchase, in that case we can’t offer you a full refund or exchange.
        </Text>
          <br />
          <br />
          <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>TO BE ELIGIBLE FOR A RETURN </h1>
        </Text>
        <Text size="lg" color="dimmed">
        <ul>
            <li>Item should be unused.</li>
            <li>The item should be in the same condition.</li>
            <li>Item should be in the same packaging.</li>
            <li>Toys cannot be returned.</li>
            <li>To complete your return, we require a receipt or proof of purchase.</li>
            <li>Please do not send your purchase back to the manufacturer.</li>
          </ul>
          </Text>
          <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>SITUATIONS WHERE ONLY PARTIAL REFUNDS ARE GRANTED </h1>
        </Text>
        <Text size="lg" color="dimmed">
          <ul>
            <li>Book with obvious sign of use.</li>
            <li>Stationery, toys, and educational toys that have been used.</li>
            <li>Any item not in its original condition, damaged or missing parts for reasons not due to our error.</li>
            <li>Any item that is returned more than 15 days after delivery.</li>
          </ul>
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>REFUNDS </h1>
        </Text>
        <Text size="lg" color="dimmed">
        Once your return is received and inspected, we will send you an    or a message on   to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          <br />
          <br />
          If you are approved, then your return will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>
          LATE OR MISSING REFUNDS:
          </h1>
        </Text>
        <Text size="lg" color="dimmed">
        If you haven’t received a refund yet, first check your bank account again.
Next, contact your bank. There is often some processing time before a refund is posted.
If you’ve done all of this and still you have not received your refund yet, please contact us at
              <a className={classes.link}>
              <IconMail
                size={20}
                stroke={2}
                style={{ display: "inlineFlex" }}
              />{" "}
              &nbsp;sale@darsi.pk
            </a>

        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Sale items</h1>
        </Text>
        <Text size="lg" color="dimmed">
        Only regular-priced items may be refunded. Sale items cannot be refunded.
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Exchanges </h1>
        </Text>
        <Text size="lg" color="dimmed">
        We only refund items if they are defective or damaged. If you need to exchange it for the same item, send us an email at <a className={classes.link}>
              <IconMail
                size={20}
                stroke={2}
                style={{ display: "inlineFlex" }}
              />{" "}
              &nbsp;info@darsi.pk
            </a>
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Gifts</h1>
        </Text>
        <Text size="lg" color="dimmed">
        <ul>
            <li>	If the item was marked as a gift when purchased and shipped directly to you, you’ll receive a gift credit for the value of your return. Once the returned item is received, a gift certificate will be mailed to you.</li>
            <li>	If the item wasn’t marked as a gift when purchased, or the giver had the order shipped to themselves to give to you later, we will send a refund to the gift giver, and they will find out about your return.</li>
          </ul>
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Shipping Returns</h1>
        </Text>
        <Text size="lg" color="dimmed">
        <ul>
            <li>You will be responsible for paying your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund</li>
            <li>Depending on where you live, the time it may take for your exchanged product to reach you may vary.</li>
            <li>If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance. We don’t guarantee that we will receive your returned item.</li>
          </ul>
        </Text>
        <Text weight={500} size="lg" mb={5} color="#f85606">
          <h1>Need help?</h1>
        </Text>
        <Text size="lg" color="dimmed">
        Contact us at <span><IconMail
                size={20}
                stroke={2}
                // style={{ display: "inlineFlex" }}
              />{" "}</span> info@darsi.pk for questions related to refunds and returns..
        </Text>
      </div>
      {/* <Image src={image.src} className={classes.image} /> */}
    </div>
  );
}
