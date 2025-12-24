import {
  Container, Text, TextInput, PasswordInput, Button, Group, Box, Alert, Anchor
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

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isCustomer, setIsCustomer] = useState(true);

  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      password: (v) => (v.length >= 6 ? null : "Password must be 6+ chars"),
    },
    validateInputOnChange: true,
  });

  const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.18 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.44 13.09 17.77 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.21-.43-4.73H24v9.02h12.7c-.55 2.96-2.2 5.48-4.7 7.18l7.2 5.6C43.02 36.92 46.5 30.95 46.5 24z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.2-5.6c-2 1.35-4.57 2.15-8.7 2.15-6.23 0-11.56-3.59-13.46-8.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

  useEffect(() => window.scrollTo(0, 0), []);

  const handleSubmit = async (values: any) => {
    try {
      const res = await login(dispatch, { email: values.email, password: values.password });
      if (!res || res.status !== 200) throw new Error("Server error");

      const userData = res.data.data;
      if (!userData) throw new Error("Invalid credentials");

      if (userData.role !== "Customer") {
        setIsCustomer(false);
        return;
      }

      // ✅ Save to Redux & LocalStorage
      dispatch(loginSuccess(userData));
      localStorage.setItem("token", res.data.token || "");

      showNotification({ message: res.data.message || "Login successful!", color: "green" });
      router.push("/userInfo");
    } catch (err) {
      console.error(err);
      showNotification({ message: "Login failed. Try again!", color: "red" });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://darsi-backend.vercel.app/api/auth/google/callback`;
  };

  return (
    <>
      <Head>
        <title>Darsi | Login</title>
      </Head>
      <Container size="xs" mt={30} mb={30} p={20} bg="white">
        {!isCustomer && (
          <Alert mb="md" icon={<IconInfoCircle size={16} />} title="Alert!">
            You are a Vendor or Referrer. Please go to{" "}
            <Anchor href="https://dashboard.darsi.pk/" target="_blank">Vendor Dashboard</Anchor>.
          </Alert>
        )}

        <Text weight={600} size="xl" mb="md">Login</Text>

        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <TextInput label="Email" placeholder="Enter email" withAsterisk {...form.getInputProps("email")} />
          <PasswordInput label="Password" placeholder="Enter password" withAsterisk mt="sm" {...form.getInputProps("password")} />

          {/* <Button fullWidth mt="md" variant="outline" onClick={handleGoogleLogin}>
            Continue with Google
          </Button> */}
{/* 
          <Text align="center" color="dimmed" my="sm">
  — OR —
</Text>

        <Button
  fullWidth
  mt="md"
  onClick={handleGoogleLogin}
  styles={{
    root: {
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      color: "#555",
      height: 48,
      fontWeight: 500,
      boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    },
    // rootHovered: {
    //   backgroundColor: "#f8f8f8",
    // },
  }}
>
  <Group spacing="sm">
    <GoogleIcon />
    <Text size="sm">Continue with Google</Text>
  </Group>
</Button> */}

<div className="divider">
  <span>OR</span>
</div>


<button className="google-btn" onClick={handleGoogleLogin}>
  <span className="google-icon">
    <GoogleIcon />
  </span>
  <span className="google-text">Continue with Google</span>
</button>







          <Group position="apart" mt="md">
            <Box>
              <Button type="button" variant="subtle" size="xs" component="a" href="https://dashboard.darsi.pk/login" target="_blank">
                Vendor or Referrer? Login here
              </Button>
            </Box>
            <Box>
              <Button type="button" variant="subtle" size="xs" component={Link} href="/forgot-password">
                Forgot Password
              </Button>
              <Button type="submit" style={{ backgroundColor: "#f85606" }}>Submit</Button>
            </Box>
          </Group>
        </form>
      </Container>
    </>
  );
}
