import {
  Container,
  Text,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Head from "next/head";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/action/auth_api";
import { get_packages } from "../../redux/action/packages";

function Register() {
  let router = useRouter();
  const { type } = router.query;
  const dispatch = useDispatch();
  const { packages } = useSelector((state: any) => state.package);
  const [_packages, set_packages] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    switch (type) {
      case "Customer":
        break;
      default:
        router.push("/");
    }
  }, []);
  useEffect(() => {
    get_packages(dispatch);
    let pac = packages?.map((p: any) => ({
      label: p.title,
      value: p._id,
    }));
    set_packages(pac);
  }, []);
  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      email: "",
      password: "",
      cpassword: "",
      firstname: "",
      lastname: "",
      role: "",
      referred_by: undefined,
      referral_package: undefined,
    },
    validate: {
      email: (value) =>
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/.test(value)
          ? null
          : "Invalid email",
      password: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          value
        )
          ? null
          : "Minimum eight characters, at least one special character, one letter and one number",
      firstname: (value) =>
        !value
          ? "First name is required"
          : /^[a-zA-Z]+$/.test(value)
          ? null
          : "Invalid first name",
      lastname: (value) =>
        !value
          ? "Last name is required"
          : /^[a-zA-Z]+$/.test(value)
          ? null
          : "Invalid last name",
      cpassword: (value, values) =>
        value !== values.password
          ? "Password and Custom Password must be match"
          : null,
      // referred_by: (value) =>
      //   type === "Referrer" && !value ? "please select a referrer" : null,
      referral_package: (value) =>
        type === "Referrer" && !value ? "please select a Package" : null,
    },
  });

  const handleSubmit = async (values: any) => {
    let res = await register(dispatch, { ...values, role: type });
    if (res.data.success) {
      form.reset();
      router.push("/");
      showNotification({
        autoClose: 5000,
        message: res.data?.message,
        color: "green",
      });
    } else {
      showNotification({
        autoClose: 5000,
        message: res.data?.message || "Something went wrong!",
        color: "red",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Darsi | Signup</title>
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
          Signup as a {type}
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)} autoComplete="off">
          <TextInput
            withAsterisk
            label="First Name"
            placeholder="Enter Your First Name"
            {...form.getInputProps("firstname")}
          />
          <TextInput
            withAsterisk
            label="Last Name"
            placeholder="Enter Your Last Name"
            {...form.getInputProps("lastname")}
          />
          <TextInput
            withAsterisk
            label="Email"
            autoComplete="new-email"
            placeholder="Enter Your Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            placeholder="Enter Your Password"
            label="Password"
            withAsterisk
            autoComplete="off"
            {...form.getInputProps("password")}
          />
       <PasswordInput
  placeholder="Enter Your Confirm Password"
  label="Confirm Password"
  withAsterisk
  {...form.getInputProps("cpassword")}
/>

<Button
  fullWidth
  mt="md"
  variant="outline"
  onClick={() =>
    (window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}api/auth/google`)
  }
>
  Continue with Google
</Button>


          {type === "Referrer" && (
            <>
              <Select
                withAsterisk
                label="Select Your Package"
                placeholder="Pick one"
                data={_packages}
                {...form.getInputProps("referral_package")}
              />
              <TextInput
                // withAsterisk
                label="Referred by"
                placeholder="Enter Your Referred by"
                {...form.getInputProps("referred_by")}
              />
            </>
          )}
          <Group position="right" mt="md">
            <Button
              type="button"
              variant="subtle"
              radius="xs"
              size="xs"
              component={Link}
              href="/login"
            >

            
              Are you already a member? Please login
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

export default Register;
