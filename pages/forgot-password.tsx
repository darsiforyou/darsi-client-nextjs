import {
  Button,
  Container,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  changeUserPassword,
  forgotPasswordOTP,
} from "../redux/action/auth_api";

function ForgotPassword() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resending, setResending] = useState(false);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      user_email: "",
      otp_code: "",
      new_password: "",
    },
    validate: {
      user_email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email",
      otp_code: (value) => (isOtpSent ? (!value ? "Code is required" : null) : null),
      new_password: (value) =>
        isOtpSent
          ? /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
              value
            )
            ? null
            : "Minimum 8 chars, 1 letter, 1 number, 1 special char"
          : null,
    },
  });

  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Send OTP
  const handleGetOtp = async (values: any) => {
    try {
      const res = await forgotPasswordOTP(values.user_email);
      if (res.status === 200) {
        showNotification({
          message: res.data?.message || "OTP sent successfully",
          color: "green",
          autoClose: 5000,
        });
        setIsOtpSent(true);
      } else {
        showNotification({
          message: "Something went wrong!",
          color: "red",
          autoClose: 5000,
        });
      }
    } catch (err) {
      showNotification({
        message: "Failed to send OTP",
        color: "red",
        autoClose: 5000,
      });
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await forgotPasswordOTP(form.values.user_email);
      if (res.status === 200) {
        showNotification({
          message: res.data?.message || "OTP resent successfully",
          color: "green",
          autoClose: 5000,
        });
      } else {
        showNotification({
          message: "Failed to resend OTP",
          color: "red",
          autoClose: 5000,
        });
      }
    } catch (err) {
      showNotification({
        message: "Failed to resend OTP",
        color: "red",
        autoClose: 5000,
      });
    } finally {
      setResending(false);
    }
  };

  // Reset password after OTP verification
  const handleChangePassword = async (values: any) => {
    const body = {
      email: values.user_email,
      otp: values.otp_code,
      newPassword: values.new_password,
    };

    try {
      const res = await changeUserPassword(body);
      if (res.status === 200) {
        showNotification({
          message: res.data?.message || "Password reset successfully",
          color: "green",
          autoClose: 5000,
        });
        router.push("/login");
      } else {
        showNotification({
          message: res.data?.message || "Something went wrong",
          color: "red",
          autoClose: 5000,
        });
      }
    } catch (err) {
      showNotification({
        message: "Failed to reset password",
        color: "red",
        autoClose: 5000,
      });
    }
  };

  // Form submit
  const handleSubmit = (values: any) => {
    if (isOtpSent) {
      handleChangePassword(values);
    } else {
      handleGetOtp(values);
    }
  };

  return (
    <>
      <Head>
        <title>Darsi | Forgot Password</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Container
        size="xs"
        sx={{
          marginTop: 30,
          marginBottom: 30,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text weight={600} size="xl" sx={{ marginBottom: 20 }}>
          Forgot Password
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            withAsterisk
            readOnly={isOtpSent}
            {...form.getInputProps("user_email")}
          />

          {isOtpSent && (
            <>
              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                withAsterisk
                {...form.getInputProps("new_password")}
              />
              <TextInput
                label="OTP Code"
                placeholder="Enter OTP code"
                withAsterisk
                {...form.getInputProps("otp_code")}
              />
            </>
          )}

          <Group position="right" mt="md">
            {isOtpSent && (
              <Button
                type="button"
                variant="subtle"
                size="xs"
                radius="xs"
                loading={resending}
                onClick={handleResendOtp}
              >
                Resend Code
              </Button>
            )}
            <Button
              type="submit"
              sx={{
                backgroundColor: "#f85606",
                "&:hover": { backgroundColor: "#f85606", transform: "scale(1.05)" },
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
