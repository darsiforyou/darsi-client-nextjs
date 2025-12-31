import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createStyles,
  Image,
  Avatar,
  Text,
  Group,
  Container,
  Button,
  Divider,
  Grid,
  ActionIcon,
  Modal,
  Title,
  Box,
  Card,
  TextInput,
  PasswordInput,
} from "@mantine/core";
import { NavLink } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useQuery } from "@tanstack/react-query";
import { publicRequest } from "../requestMethods";
import { format } from "fecha";
import Head from "next/head";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import {
  IconAt,
  IconEye,
  IconSettings,
  IconActivity,
  IconLock,
  IconMail,
} from "@tabler/icons";
import { loginSuccess } from "../redux/reducers/userRedux";

// Styles
const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },
  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

// Fetch user orders
const fetchOrderByUser = async ({ queryKey }: any) => {
  const [_, { search, page, limit, user, ...filters }] = queryKey;
  const params = new URLSearchParams(filters);
  const res = await publicRequest.get(
    `/orders?search=${search}&page=${page}&limit=${limit}&user=${user}&${params}`
  );
  return res.data;
};

export default function UserInfo() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { classes } = useStyles();

  // Check Redux user
  const user = useSelector((state: any) => state.user.currentUser);

  // Token handling for Google login
  useEffect(() => {
    const tokenFromQuery = router.query.token as string;
    if (tokenFromQuery && !user) {
      // Fetch user info from backend with token
      publicRequest
        .get("/users/me", {
          headers: { Authorization: `Bearer ${tokenFromQuery}` },
        })
        .then((res) => {
          dispatch(loginSuccess({ ...res.data.user, accessToken: tokenFromQuery }));
          localStorage.setItem("token", tokenFromQuery);
        })
        .catch(() => {
          router.push("/login");
        });
    }
  }, [router.query, dispatch, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeTab, setActiveTab] = useState<
    "orders" | "profile" | "password" | "forgotPassword" | "otpReset"
  >("orders");

  const [profile, setProfile] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [forgotEmail, setForgotEmail] = useState(user?.email || "");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [otpData, setOtpData] = useState({
    email: user?.email || "",
    otp: "",
    newPassword: "",
  });
  const [otpLoading, setOtpLoading] = useState(false);

  // Orders filters and query
  const [filters, setFilters] = useState({
    search: "",
    limit: 10,
    page: 1,
    user: user?._id || "",
  });

  const { isLoading, data: orders, refetch } = useQuery(
    ["orders", filters],
    fetchOrderByUser,
    { enabled: !!user, refetchOnWindowFocus: false }
  );

  const onPagination = async (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    await refetch();
  };

  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const viewProductDetails = (record: any) => {
    setSelectedProduct(record);
    setViewModalOpened(true);
  };

  // Profile update
  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();
    try {
      await publicRequest.put(
        `/users/${user._id}`,
        profile,
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      showNotification({
        message: "Profile updated successfully!",
        color: "green",
        autoClose: 5000,
      });
    } catch {
      showNotification({
        message: "Server error! Try again later.",
        color: "red",
        autoClose: 5000,
      });
    }
  };

  // Password update
  const handlePasswordUpdate = async (e: any) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showNotification({
        message: "New password and confirm password do not match!",
        color: "red",
      });
    }
    try {
      await publicRequest.put(
        `/users/changeUserPassword/${user._id}`,
        { oldPassword: passwords.oldPassword, newPassword: passwords.newPassword },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      showNotification({ message: "Password updated successfully!", color: "green" });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      showNotification({
        message: err.response?.data?.message || "Password update failed!",
        color: "red",
      });
    }
  };

  // Forgot Password
  const handleForgotPassword = async (e: any) => {
    e.preventDefault();
    if (!forgotEmail) return showNotification({ message: "Enter email!", color: "red" });
    setForgotLoading(true);
    try {
      const res = await publicRequest.get(`/users/forgotPasswordOtp/${forgotEmail}`);
      showNotification({ message: res.data.message || "OTP sent!", color: "green" });
      setOtpData({ ...otpData, email: forgotEmail });
      setActiveTab("otpReset");
    } catch {
      showNotification({ message: "Failed to send OTP!", color: "red" });
    } finally {
      setForgotLoading(false);
    }
  };

  // OTP Reset
  const handleOtpReset = async (e: any) => {
    e.preventDefault();
    if (!otpData.email || !otpData.otp || !otpData.newPassword)
      return showNotification({ message: "Fill all fields!", color: "red" });
    setOtpLoading(true);
    try {
      const res = await publicRequest.post("/users/resetPassword", otpData);
      showNotification({ message: res.data.message || "Password reset!", color: "green" });
      setOtpData({ email: "", otp: "", newPassword: "" });
      setActiveTab("password");
    } catch {
      showNotification({ message: "OTP reset failed!", color: "red" });
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Darsi | User Profile</title>
      </Head>

      <Container size="lg" p={20} my={30} bg="white">
        {/* View Order Modal */}
        <Modal
          opened={viewModalOpened}
          onClose={() => setViewModalOpened(false)}
          size="lg"
          overflow="inside"
          radius="md"
          padding="xl"
        >
          {selectedProduct && (
            <Box sx={{ maxHeight: "80vh", overflowY: "auto", paddingRight: 10 }}>
              <Title order={4} mb="md" align="center">Products Information</Title>
              {selectedProduct.items?.map((item: any) => (
                <Card key={item._id} shadow="sm" mb="md" radius="md" sx={{ border: "1px solid #eee" }}>
                  <Group noWrap spacing="md" align="flex-start">
                    <Image
                      width={120}
                      src={item.lineItems?.media?.[0]?.imageURL || "https://via.placeholder.com/120"}
                      alt={item.title}
                      radius="sm"
                    />
                    <Box sx={{ flex: 1 }}>
                      <Text weight={600} size="md">{item.title}</Text>
                      <Text size="sm" color="dimmed" lineClamp={3}>
                        {item.lineItems?.description || "No description available."}
                      </Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </Box>
          )}
        </Modal>

        {/* User Info Header */}
        <Group noWrap sx={{ justifyContent: "space-between", alignItems: "end" }}>
          <Group noWrap>
            <Avatar src={""} size={94} radius="md" />
            <div>
              <Text size="xs" sx={{ textTransform: "uppercase" }} weight={700} color="dimmed">
                {user?.role || ""}
              </Text>
              <Text size="lg" weight={500} className={classes.name}>
                {user?.firstname} {user?.lastname}
              </Text>
              <Group noWrap spacing={10} mt={3}>
                <IconAt stroke={1.5} size={16} className={classes.icon} />
                <Text size="xs" color="dimmed">{user?.email}</Text>
              </Group>
            </div>
          </Group>
        </Group>

        <Divider my={20} />

        <Grid columns={4} sx={{ alignItems: "start" }}>
          {/* Sidebar */}
          <Grid.Col sm={4} md={1}>
            <Box sx={{ width: "100%" }}>
              <NavLink label="My Orders" icon={<IconActivity size={16} />} active={activeTab === "orders"} onClick={() => setActiveTab("orders")} />
              <NavLink label="Edit Profile" icon={<IconSettings size={16} />} active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
              <NavLink label="Change Password" icon={<IconLock size={16} />} active={activeTab === "password"} onClick={() => setActiveTab("password")} />
              <NavLink label="Forgot Password" icon={<IconMail size={16} />} active={activeTab === "forgotPassword"} onClick={() => setActiveTab("forgotPassword")} />
            </Box>
          </Grid.Col>

          {/* Content */}
          <Grid.Col sm={4} md={3}>
            <Box sx={{ width: "100%" }}>
              {/* Orders Table */}
              {activeTab === "orders" && (
                <DataTable
                  withColumnBorders
                  striped
                  highlightOnHover
                  minHeight="150px"
                  page={orders?.data?.page || 1}
                  onPageChange={onPagination}
                  totalRecords={orders?.data?.totalDocs || 0}
                  recordsPerPage={filters.limit}
                  idAccessor="_id"
                  fontSize="sm"
                  records={orders?.data?.docs || []}
                  fetching={isLoading}
                  columns={[
                    { accessor: "_id", title: "#", render: (record: any) => orders?.data?.docs.indexOf(record) + 1 },
                    { accessor: "createdAt", render: (record: any) => format(new Date(record.createdAt), "DD-MMM-YY") },
                    { accessor: "order_number", title: "Order No" },
                    { accessor: "totalQty", title: "Qty", render: ({ cart }: any) => cart.totalQty },
                    { accessor: "totalCost", title: "Cost", render: ({ cart }: any) => cart.totalCost },
                    { accessor: "actions", title: "View", render: (record: any) => <ActionIcon color="blue" onClick={() => viewProductDetails(record)}><IconEye size={18} /></ActionIcon> },
                  ]}
                />
              )}

              {/* Profile */}
              {activeTab === "profile" && (
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Edit Profile</Title>
                  <form onSubmit={handleProfileUpdate}>
                    <Grid>
                      <Grid.Col md={6}><TextInput label="First Name" value={profile.firstname} onChange={(e) => setProfile({ ...profile, firstname: e.target.value })} required /></Grid.Col>
                      <Grid.Col md={6}><TextInput label="Last Name" value={profile.lastname} onChange={(e) => setProfile({ ...profile, lastname: e.target.value })} required /></Grid.Col>
                      <Grid.Col md={6}><TextInput label="Email" value={profile.email} disabled /></Grid.Col>
                      <Grid.Col md={6}><TextInput label="Role" value={user?.role} disabled /></Grid.Col>
                    </Grid>
                    <Button mt="md" type="submit">Update Profile</Button>
                  </form>
                </Card>
              )}

              {/* Password */}
              {activeTab === "password" && (
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Change Password</Title>
                  <form onSubmit={handlePasswordUpdate}>
                    <Grid>
                      <Grid.Col md={12}><PasswordInput label="Old Password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} required /></Grid.Col>
                      <Grid.Col md={12}><PasswordInput label="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required /></Grid.Col>
                      <Grid.Col md={12}><PasswordInput label="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required /></Grid.Col>
                    </Grid>
                    <Button mt="md" type="submit">Update Password</Button>
                  </form>
                </Card>
              )}

              {/* Forgot Password */}
              {activeTab === "forgotPassword" && (
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Forgot Password</Title>
                  <form onSubmit={handleForgotPassword}>
                    <TextInput label="Email" icon={<IconMail size={16} />} value={forgotEmail} disabled />
                    <Button mt="md" type="submit" loading={forgotLoading}>Send Reset Link / OTP</Button>
                  </form>
                </Card>
              )}

              {/* OTP Reset */}
              {activeTab === "otpReset" && (
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Verify OTP & Reset Password</Title>
                  <form onSubmit={handleOtpReset}>
                    <TextInput label="Email" value={otpData.email} onChange={(e) => setOtpData({ ...otpData, email: e.currentTarget.value })} required />
                    <TextInput label="OTP" value={otpData.otp} onChange={(e) => setOtpData({ ...otpData, otp: e.currentTarget.value })} required />
                    <PasswordInput label="New Password" value={otpData.newPassword} onChange={(e) => setOtpData({ ...otpData, newPassword: e.currentTarget.value })} required />
                    <Button mt="md" type="submit" loading={otpLoading}>Reset Password</Button>
                  </form>
                </Card>
              )}

            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}
