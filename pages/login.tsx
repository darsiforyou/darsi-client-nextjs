import {
  Container,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Alert,
  Anchor,
  Modal,
  Avatar,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconInfoCircle } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/auth_api";
import { loginSuccess } from "../redux/reducers/userRedux";

/* ================= GOOGLE ICON ================= */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.18 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.44 13.09 17.77 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.21-.43-4.73H24v9.02h12.7c-.55 2.96-2.2 5.48-4.7 7.18l7.2 5.6C43.02 36.92 46.5 30.95 46.5 24z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.2-5.6c-2 1.35-4.57 2.15-8.7 2.15-6.23 0-11.56-3.59-13.46-8.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

/* ================= MAIN COMPONENT ================= */
export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isCustomer, setIsCustomer] = useState(true);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  useEffect(() => window.scrollTo(0, 0), []);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length >= 6 ? null : "Password must be 6+ characters"),
    },
    validateInputOnChange: true,
  });

  /* ================= EMAIL LOGIN ================= */
  const handleSubmit = async (values: any) => {
    try {
      const res = await login(dispatch, values);
      if (!res || res.status !== 200) throw new Error();

      const userData = res.data.data;
      if (userData.role !== "Customer") {
        setIsCustomer(false);
        return;
      }

      dispatch(loginSuccess(userData));
      localStorage.setItem("token", res.data.token || "");

      showNotification({
        message: res.data.message || "Login successful!",
        color: "green",
      });

      router.push("/userInfo");
    } catch {
      showNotification({
        message: "Login failed. Please try again!",
        color: "red",
      });
    }
  };

  /* ================= GOOGLE LOGIN HANDLERS ================= */

  // Uses last signed-in Google account
  const googleLoginDefault = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  // Forces Google to ask for email & password
  // const googleLoginDifferentAccount = () => {
  //   window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?prompt=select_account`;
  // };
const googleLoginDifferentAccount = () => {
  const width = 500;
  const height = 600;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/select`,
    "Google Login",
    `width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=yes`
  );

  if (!popup) {
    alert("Popup blocked. Please allow popups.");
    return;
  }

  // Listen for token/user from popup
  const handleMessage = (event: MessageEvent) => {
    if (!event.origin.includes(window.location.origin)) return;

    const { token, user } = event.data;

    if (token && user) {
      localStorage.setItem("token", token);
      dispatch(loginSuccess(user));
      router.push("/userInfo");
    }

    window.removeEventListener("message", handleMessage);
    if (!popup.closed) popup.close();
  };

  window.addEventListener("message", handleMessage);
};



  return (
    <>
      <Head>
        <title>Darsi | Login</title>
      </Head>

      <Container size="xs" mt={40} mb={40} p={24} bg="white">
        {!isCustomer && (
          <Alert mb="md" icon={<IconInfoCircle size={16} />} title="Alert!">
            You are a Vendor or Referrer. Please login at{" "}
            <Anchor href="https://dashboard.darsi.pk/" target="_blank">
              Vendor Dashboard
            </Anchor>
            .
          </Alert>
        )}

        <Text fw={600} size="xl" mb="md">
          Login
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <TextInput
            label="Email"
            placeholder="Enter email"
            withAsterisk
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Enter password"
            withAsterisk
            mt="sm"
            {...form.getInputProps("password")}
          />

          <Button
            fullWidth
            mt="md"
            type="submit"
            style={{ backgroundColor: "#f85606" }}
          >
            Login
          </Button>

          <Divider my="lg" label="OR" labelPosition="center" />

          <Button
            fullWidth
            variant="outline"
            leftIcon={<GoogleIcon />}
            onClick={() => setGoogleModalOpen(true)}
            styles={{
              root: { height: 48, fontWeight: 500, borderRadius: 8 },
            }}
          >
            Continue with Google
          </Button>

          <Group position="apart" mt="md">
            <Button
              variant="subtle"
              size="xs"
              component="a"
              href="https://dashboard.darsi.pk/login"
              target="_blank"
            >
              Vendor or Referrer?
            </Button>

            <Button
              variant="subtle"
              size="xs"
              component={Link}
              href="/forgot-password"
            >
              Forgot Password?
            </Button>
          </Group>
        </form>
      </Container>

      {/* ================= GOOGLE MODAL ================= */}
      <Modal
        opened={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        centered
        withCloseButton={false}
        radius="md"
        overlayOpacity={0.6}
      >
        <Box ta="center" p="md">
          <Avatar size={56} radius="xl" mx="auto" mb="sm">
            <GoogleIcon />
          </Avatar>

          <Text fw={600} size="lg">
            Continue with Google
          </Text>

          <Text size="sm" color="dimmed" mt={4}>
            Choose an account to continue
          </Text>

          {/* CONTINUE WITH EXISTING ACCOUNT */}
          <Box
            mt="md"
            p="sm"
            sx={{
              border: "1px solid #eee",
              borderRadius: 8,
              cursor: "pointer",
              "&:hover": { backgroundColor: "#fafafa" },
            }}
            onClick={googleLoginDefault}
          >
            <Group>
              <Avatar radius="xl" color="orange">
                U
              </Avatar>
              <Box>
                <Text size="sm" fw={500}>
                  Continue with your Google account
                </Text>
                <Text size="xs" color="dimmed">
                  Uses last signed-in account
                </Text>
              </Box>
            </Group>
          </Box>

          <Divider my="md" label="OR" labelPosition="center" />

          {/* USE DIFFERENT ACCOUNT (FIXED) */}
          <Button
            fullWidth
            variant="outline"
            onClick={googleLoginDifferentAccount}
            styles={{
              root: {
                borderColor: "#f85606",
                color: "#f85606",
              },
            }}
          >
            Use a different account
          </Button>

          <Button
            fullWidth
            mt="sm"
            variant="subtle"
            color="gray"
            onClick={() => setGoogleModalOpen(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
}
