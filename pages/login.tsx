import {
  Container,
  Text,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Box,
  Alert,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/auth_api";
import {
  notification_off,
  notification_on,
} from "../redux/reducers/notificationRedux";

function Login() {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      password: (value) => (value.length < 6 ? "Invalid password" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  const [isCustomer, setIsCustomer] = useState(true);
  const dispatch = useDispatch();
  let router = useRouter();
  const handleSubmit = async (values: any) => {
    let res = await login(dispatch, {
      email: values.email,
      password: values.password,
    });
    if (res.data.role !== "Customer") {
      return setIsCustomer(false);
    }
    if (res.status !== 200) {
      dispatch(
        notification_on({ message: res.data?.message || "Something went wrong!", type: "Error" })
      );
      setTimeout(() => {
        dispatch(notification_off());
      }, 3000);
      return;
    }

    router.push("/");
    dispatch(notification_on({ message: res.data?.message, type: "Success" }));
    setTimeout(() => {
      dispatch(notification_off());
    }, 3000);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Head>
        <title>Darsi | Login</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container
        size="xs"
        sx={{
          marginBottom: 30,
          marginTop: 30,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        {!isCustomer && (
          <Alert mb={"md"} icon={<IconInfoCircle size={16} />} title="Alert!">
            It seems like you are a Vendor or Referrer Please go to this{" "}
            <Anchor
              href="https://dashboard-darsi.netlify.app/"
              underline
              target="_blank"
            >
              This Link
            </Anchor>{" "}
            to sign in as vendor or referral.
          </Alert>
        )}

        <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
          Login
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="Enter Your Email"
            autoComplete="off"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            placeholder="Enter Your Password"
            label="Password"
            withAsterisk
            autoComplete="off"
            {...form.getInputProps("password")}
          />
          <Group position="apart" mt="md">
            <Box>
              <Button
                type="button"
                variant="subtle"
                radius="xs"
                size="xs"
                component="a"
                href="https://dashboard-darsi.netlify.app/login"
                target="_blank"
              >
                Are you a Vendor or Referrer? login here.
              </Button>
            </Box>
            <Box>
              <Button
                type="button"
                variant="subtle"
                radius="xs"
                size="xs"
                component={Link}
                href="/forgot-password"
              >
                Forgot Password
              </Button>
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#f85606",
                  "&:hover": {
                    backgroundColor: "#f85606",
                    transform: "scale(1.1)",
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </Group>
        </form>
      </Container>
    </>
  );
}

export default Login;
