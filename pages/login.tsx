// import {
//   Container,
//   Text,
//   TextInput,
//   Button,
//   Group,
//   PasswordInput,
//   Box,
//   Alert,
//   Anchor,
// } from "@mantine/core";
// import { useForm } from "@mantine/form";
// import { IconInfoCircle } from "@tabler/icons";
// import { showNotification } from "@mantine/notifications";
// import Head from "next/head";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { login } from "../redux/action/auth_api";
// import {
//   notification_off,
//   notification_on,
// } from "../redux/reducers/notificationRedux";

// function Login() {
//   const form = useForm({
//     validateInputOnChange: true,
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validate: {
//       password: (value) => (value.length < 6 ? "Invalid password" : null),
//       email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
//     },
//   });
//   const [isCustomer, setIsCustomer] = useState(true);
//   const dispatch = useDispatch();
//   let router = useRouter();
//   const handleSubmit = async (values: any) => {
//     let res = await login(dispatch, {
//       email: values.email,
//       password: values.password,
//     });
//     if (res.data.role !== "Customer") {
//       return setIsCustomer(false);
//     }
//     if (res.status !== 200) {
//       showNotification({
//         autoClose: 5000,
//         message: "Something went wrong!",
//         color: "red",
//       });
//       return;
//     }
//     router.push("/");
//     showNotification({
//       autoClose: 5000,
//       message: res.data?.message,
//       color: "green",
//     });
//   };
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);
//   return (
//     <>
//       <Head>
//         <title>Darsi | Login</title>
//         <meta name="viewport" content="initial-scale=1.0, width=device-width" />
//       </Head>
//       <Container
//         size="xs"
//         sx={{
//           marginBottom: 30,
//           marginTop: 30,
//           backgroundColor: "white",
//           padding: 20,
//         }}
//       >
//         {!isCustomer && (
//           <Alert mb={"md"} icon={<IconInfoCircle size={16} />} title="Alert!">
//             It seems like you are a Vendor or Referrer Please go to this{" "}
//             <Anchor
//               href="https://dashboard.darsi.pk/"
//               underline
//               target="_blank"
//             >
//               This Link
//             </Anchor>{" "}
//             to sign in as vendor or referral.
//           </Alert>
//         )}

//         <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
//           Login
//         </Text>
//         <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
//           <TextInput
//             withAsterisk
//             label="Email"
//             placeholder="Enter Your Email"
//             autoComplete="off"
//             {...form.getInputProps("email")}
//           />
//           <PasswordInput
//             placeholder="Enter Your Password"
//             label="Password"
//             withAsterisk
//             autoComplete="off"
//             {...form.getInputProps("password")}
//           />
//           <Group position="apart" mt="md">
//             <Box>
//               <Button
//                 type="button"
//                 variant="subtle"
//                 radius="xs"
//                 size="xs"
//                 component="a"
//                 href="https://dashboard.darsi.pk/login"
//                 target="_blank"
//               >
//                 Are you a Vendor or Referrer? login here.
//               </Button>
//             </Box>
//             <Box>
//               <Button
//                 type="button"
//                 variant="subtle"
//                 radius="xs"
//                 size="xs"
//                 component={Link}
//                 href="/forgot-password"
//               >
//                 Forgot Password
//               </Button>
//               <Button
//                 type="submit"
//                 sx={{
//                   backgroundColor: "#f85606",
//                   "&:hover": {
//                     backgroundColor: "#f85606",
//                     transform: "scale(1.1)",
//                   },
//                 }}
//               >
//                 Submit
//               </Button>
//             </Box>
//           </Group>
//         </form>
//       </Container>
//     </>
//   );
// }

// export default Login;


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
import { showNotification } from "@mantine/notifications";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/action/auth_api";

function Login() {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: { email: "", password: "" },
    validate: {
      password: (value) => (value.length < 6 ? "Invalid password" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const [isCustomer, setIsCustomer] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    try {
      const res = await login(dispatch, {
        email: values.email,
        password: values.password,
      });

      // API failure or invalid credentials
      if (!res || res.status !== 200) {
        showNotification({
          message: "Something went wrong!",
          color: "red",
          autoClose: 5000,
        });
        return;
      }

      const userData = res.data.data;

      if (!userData) {
        showNotification({
          message: "Invalid credentials!",
          color: "red",
          autoClose: 5000,
        });
        return;
      }

      // Vendor/Referrer check
      if (userData.role !== "Customer") {
        setIsCustomer(false);
        return;
      }

      //after login localstorage save data

      localStorage.setItem("customerInfo", JSON.stringify(userData));

    // Customer login success → redirect to UserInfo page
      showNotification({
        message: res.data.message || "Logged in successfully!",
        color: "green",
        autoClose: 5000,
      });

      router.push("/userInfo");
    } catch (err) {
      console.error(err);
      showNotification({
        message: "Server error! Please try again later.",
        color: "red",
        autoClose: 5000,
      });
    }
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
        sx={{ marginBottom: 30, marginTop: 30, backgroundColor: "white", padding: 20 }}
      >
        {!isCustomer && (
          <Alert mb="md" icon={<IconInfoCircle size={16} />} title="Alert!">
            It seems like you are a Vendor or Referrer. Please go to{" "}
            <Anchor href="https://dashboard.darsi.pk/" target="_blank" underline>
              Vendor Dashboard
            </Anchor>{" "}
            to login.
          </Alert>
        )}

        <Text weight={600} size="xl" mb="md">
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
            label="Password"
            placeholder="Enter Your Password"
            withAsterisk
            autoComplete="off"
            {...form.getInputProps("password")}
          />

          <Group position="apart" mt="md">
            <Box>
              <Button
                type="button"
                variant="subtle"
                size="xs"
                component="a"
                href="https://dashboard.darsi.pk/login"
                target="_blank"
              >
                Vendor or Referrer? Login here
              </Button>
            </Box>

            <Box>
              <Button
                type="button"
                variant="subtle"
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
                  "&:hover": { backgroundColor: "#f85606", transform: "scale(1.05)" },
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

