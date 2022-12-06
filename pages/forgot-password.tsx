import {
  Container,
  Text,
  TextInput,
  Button,
  Group,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeUserPassword, forgotPasswordOTP } from "../redux/action/auth_api";
import {
  notification_off,
  notification_on,
} from "../redux/reducers/notificationRedux";
import { useRouter } from "next/router";
import Head from "next/head";
function ForgotPassword() {
  const [isOtpSend, setIsOtpSend] = useState(false)
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      user_email: "",
      otp_code: "",
      new_password: "",
    },
    validate: {
      user_email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      otp_code: (value) => (isOtpSend ? !value ? "Code is Required" : null : null),
      new_password: (value) =>
      (isOtpSend ? /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        value
      )
        ? null
        : "Minimum eight characters, at least one special character, one letter and one number" : null),
    },
  });
  const dispatch = useDispatch();
  let router = useRouter();
  const handleGetOtp = async (values: any) => {
    let res = await forgotPasswordOTP(values.user_email);
    if (res.status !== 200) {
      dispatch(
        notification_on({
          message: res.data?.message || "Something went wrong!",
          type: "Error",
        })
      );
      setTimeout(() => {
        dispatch(notification_off());
      }, 3000);
      return;
    }
    dispatch(notification_on({ message: res.data?.message, type: "Success" }));
    setTimeout(() => {
      dispatch(notification_off());
    }, 3000);
    setIsOtpSend(true)
  }
  const handleChangePassword = async (values: any) => {
    let res = await changeUserPassword(values);
    if (res.status !== 200) {
      dispatch(
        notification_on({
          message: res.data?.message || "Something went wrong!",
          type: "Error",
        })
      );
      setTimeout(() => {
        dispatch(notification_off());
      }, 3000);
      return;
    }
    dispatch(notification_on({ message: res.data?.message, type: "Success" }));
    setTimeout(() => {
      dispatch(notification_off());
    }, 3000);
    // setIsOtpSend(false)
    // navigate("/login", { replace: true });
  }
  const handleSubmit = (values: any) => {
    if (isOtpSend) {
      handleChangePassword(values)
    } else {
      handleGetOtp(values)
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Head>
        <title>Darsi | Forgot Password</title>
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
        <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
          Forgot Password
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Email"
            readOnly={isOtpSend}
            placeholder="Enter Your Email"
            {...form.getInputProps("user_email")}
          />
          {
            isOtpSend && (
              <>
                <PasswordInput
                  placeholder="Enter Your New Password"
                  label="New Password"
                  withAsterisk
                  {...form.getInputProps("new_password")}
                />
                <TextInput
                  withAsterisk
                  label="OPT Code"
                  placeholder="Enter OTP Code"
                  {...form.getInputProps("otp_code")}
                />
              </>
            )
          }
          <Group position="right" mt="md">
            <Button type="button" variant="subtle" radius="xs" size="xs">
              Resend Code
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
          </Group>
        </form>
      </Container>
    </>
  );
}

export default ForgotPassword;
