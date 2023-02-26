import {
    createStyles,
    Text,
    Title,
    TextInput,
    Button,
    Image,
  } from "@mantine/core";
  // import image from './image.svg';
  import {
    
    IconBrandWhatsapp,
    IconMail,
  } from "@tabler/icons";
  
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
    return (
      <div className={classes.wrapper}>
        <div className={classes.body}>
          <Title className={classes.title}>Privacy Policy</Title>
          <Text weight={500} size="lg" mb={5} color="#f85606">
            <h1>Protection Strategy</h1>
          </Text>
          <Text size="lg" color="dimmed">
          DARSI.pk is focused on safeguarding your data and relevant information insurance. Including appropriate General Information Security guidelines. Our security strategy makes sense of how we perform and applies it to our site DARSI.pk sites, items and administration.
          </Text>
          <Text weight={500} size="lg" mb={5} color="#f85606">
            <h1>How we utilize your data </h1>
          </Text>
          <Text size="lg" color="dimmed">
          We use personal information in order to promote and provide products and services, to ensure the security of our websites, and to run our business. We have set out more information on the categories of personal information that we collect, the specific ways in which that personal information is processed by us, the legal bases which permit us to do this, and the types of partners with whom we share your personal information.<br/>
<br/>
In some cases where we ask for your personal information, we do so in order for us to fulfil your request or order (e.g. needing your address to send you your order). If you do not provide that personal information we will not be able to process your request or order.
          </Text>
          <Text weight={500} size="lg" mb={5} color="#f85606">
            <h1>GIVING AND PULLING OUT YOUR ASSENT, AND REFRESHING YOUR OWN DATA </h1>
          </Text>
          <Text size="lg" color="dimmed">
          Where your consent is required for us to process your personal information, we will ask for your consent when you provide your data.  You have the right to withdraw that consent at any time. You can also update your personal information at any time. If you wish to do either, contact us at <span><IconMail
                size={20}
                stroke={2}
                // style={{ display: "inlineFlex" }}
              />{" "}</span> info@darsi.pk
              <br/>
              <br/>
              We do not sell your personal information to third parties.
          </Text>
          <Text weight={500} size="lg" mb={5} color="#f85606">
            <h1>Storing your personal information</h1>
          </Text>
          <Text size="lg" color="dimmed">
          Your personal information may be stored and processed outside of the country where it is collected. When transferring information to others, within the EEA or otherwise, we ensure that appropriate and suitable safeguards and technical measures are in place to protect your personal data. To do this, we make use of standard contractual clauses that have been approved, or we use an appropriate Privacy Shield certification or Binding Corporate Rules put in place by our suppliers, or we implement other similar measures required by laws around the world. A copy of the relevant mechanism can be provided for your review on request by sending an e-mail to our Data Privacy Officer at <span><IconMail
                size={20}
                stroke={2}
                // style={{ display: "inlineFlex" }}
              />{" "}</span> info@darsi.pk
          <br/>
<br/>
We will only keep records of your personal information for as long as is reasonably necessary for the purposes for which we have collected it, and in order to comply with any statutory or regulatory obligations in relation to the retention of records. We respect requests to stop processing your personal data for marketing purposes. This includes keeping a record of your request indefinitely so that we can respect your request in the future.
          </Text>
          
          <Text weight={500} size="lg" mb={5} color="#f85606">
            <h1>CONTACTING US</h1>
          </Text>
          <Text size="lg" color="dimmed">
          you can contact us at <span><IconMail
                size={20}
                stroke={2}
                // style={{ display: "inlineFlex" }}
              />{" "}</span> info@darsi.pk for any queries
          </Text>
          
        </div>
        {/* <Image src={image.src} className={classes.image} /> */}
      </div>
    );
  }
  