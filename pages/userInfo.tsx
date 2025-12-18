import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  Table,
  PasswordInput,
} from "@mantine/core";
import { NavLink } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { publicRequest } from "../requestMethods";
import { format } from "fecha";
import { Order } from "../types/types";
import Head from "next/head";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { IconAt, IconEye, IconSettings, IconActivity, IconLock, IconMail } from "@tabler/icons";

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
  const [_, { search, page, limit, ...filters }] = queryKey;
  const params = new URLSearchParams(filters);
  const res: AxiosResponse = await publicRequest.get(
    `/orders?search=${search}&page=${page}&limit=${limit}&${params}`
  );
  return res.data;
};

function UserInfo() {
  const user = useSelector((state: any) => state.user.currentUser);
  const router = useRouter();
  const { classes } = useStyles();

  // Redirect if user not logged in
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Tabs: "orders" | "profile" | "password"
const [activeTab, setActiveTab] = useState<"orders" | "profile" | "password" | "forgotPassword" | "otpReset">("orders");


  // Profile state
  const [profile, setProfile] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  // Password state
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });







  // Forgot password email state
  const [forgotEmail, setForgotEmail] = useState(user.email);
  const [forgotLoading, setForgotLoading] = useState(false);




const [otpData, setOtpData] = useState({
  email:user.email,
  otp: "",
  newPassword: "",
});

const [otpLoading, setOtpLoading] = useState(false);

  // Orders query
  const [filters, setFilters] = useState({
    search: "",
    limit: 10,
    page: 1,
    user: user?._id || "",
  });

  const { isLoading, data: orders, refetch } = useQuery(
    ["orders", filters],
    fetchOrderByUser,
    { enabled: true, refetchOnWindowFocus: false }
  );

  const onPagination = async (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    await refetch();
  };

  // View order modal
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
        {
          firstname: profile.firstname,
          lastname: profile.lastname,
          email: profile.email,
        },
        { headers: { Authorization: `Bearer ${user.accessToken}` } }
      );
      showNotification({
        message: "Profile updated successfully!",
        color: "green",
        autoClose: 5000,
      });
    } catch (err) {
      console.error(err);
      showNotification({
        message: "Server error! Please try again later.",
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
        autoClose: 5000,
      });
    }

    try {
       await publicRequest.put(
  `/users/changeUserPassword/${user._id}`,
  {
    oldPassword: passwords.oldPassword,
    newPassword: passwords.newPassword,
  },
  { headers: { Authorization: `Bearer ${user.accessToken}` } }
);



      showNotification({
        message: "Password updated successfully!",
        color: "green",
        autoClose: 5000,
      });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error(err);
      showNotification({
        message: err.response?.data?.message || "Password update failed!",
        color: "red",
        autoClose: 5000,
      });
    }
  };



// const handleForgotPassword = async (e: any) => {
//     e.preventDefault();
//     if (!forgotEmail) {
//       return showNotification({
//         message: "Please enter your email!",
//         color: "red",
//         autoClose: 4000,
//       });
//     }
//     setForgotLoading(true);
//     try {
//       const res = await publicRequest.get(`/users/forgotPasswordOtp/${forgotEmail}`);
//       showNotification({
//         message: res.data.message || "OTP sent to your email!",
//         color: "green",
//         autoClose: 6000,
//       });
//       setForgotEmail("");
//     } catch (err: any) {
//       console.error(err);
//       showNotification({
//         message: err.response?.data?.message || "Failed to send OTP!",
//         color: "red",
//         autoClose: 6000,
//       });
//     } finally {
//       setForgotLoading(false);
//     }
//   };



  const handleOtpReset = async (e: any) => {
  e.preventDefault();
  if (!otpData.email || !otpData.otp || !otpData.newPassword) {
    return showNotification({
      message: "Please fill all fields!",
      color: "red",
      autoClose: 4000,
    });
  }
  setOtpLoading(true);
  try {
    const res = await publicRequest.post("/users/resetPassword", otpData);
    showNotification({
      message: res.data.message || "Password reset successfully!",
      color: "green",
      autoClose: 5000,
    });
    setOtpData({ email: "", otp: "", newPassword: "" });
    setActiveTab("password"); // redirect to password tab
  } catch (err: any) {
    console.error(err);
    showNotification({
      message: err.response?.data?.message || "Failed to reset password!",
      color: "red",
      autoClose: 5000,
    });
  } finally {
    setOtpLoading(false);
  }
};

const handleForgotPassword = async (e: any) => {
  e.preventDefault();
  if (!forgotEmail) {
    return showNotification({
      message: "Please enter your email!",
      color: "red",
      autoClose: 4000,
    });
  }
  setForgotLoading(true);
  try {
    const res = await publicRequest.get(`/users/forgotPasswordOtp/${forgotEmail}`);
    showNotification({
      message: res.data.message || "OTP sent to your email!",
      color: "green",
      autoClose: 6000,
    });
    setOtpData({ ...otpData, email: forgotEmail }); // prefill email in OTP form
    setForgotEmail(user.email); // clear forgot password email input
    setActiveTab("otpReset"); // switch to OTP verification tab
  } catch (err: any) {
    console.error(err);
    showNotification({
      message: err.response?.data?.message || "Failed to send OTP!",
      color: "red",
      autoClose: 6000,
    });
  } finally {
    setForgotLoading(false);
  }
};



  return (
    <>
      <Head>
        <title>Darsi | User Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Container size="lg" sx={{ marginBottom: 30, marginTop: 30, backgroundColor: "white", padding: 20 }}>
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
      




      
      {/* Products Section */}
      <Title order={4} mb="md" align="center">Products Information</Title>

      {selectedProduct.items?.map((item: any) => {
        const imageURL = item.lineItems?.media?.[0]?.imageURL || 
                         "https://via.placeholder.com/120";

        return (
          <Card key={item._id} shadow="sm" mb="md" radius="md"  sx={{ border: "1px solid #eee" }}>
            <Group noWrap spacing="md" align="flex-start">
              <Image
                width={120}
                src={imageURL}
                alt={item.title}
                radius="sm"
              />
              <Box sx={{ flex: 1 }}>
                <Text weight={600} size="md">{item.title}</Text>
                <Text size="sm" color="dimmed" lineClamp={3}>
                  {item.lineItems?.description || "No description available."}
                </Text>

                <Table withBorder withColumnBorders mt="sm" fontSize="sm">
                  <tbody>
                    <tr>
                      <td><b>Code</b></td>
                      <td>{item.productCode || item.lineItems?.productCode}</td>
                      <td><b>Qty</b></td>
                      <td>{item.qty}</td>
                    </tr>
                    <tr>
                      <td><b>Price</b></td>
                      <td>Rs. {item.price}</td>
                      <td><b>Total</b></td>
                      <td>Rs. {item.price * item.qty}</td>
                    </tr>
                    {item.options?.map((opt: any) => (
                      <tr key={opt._id}>
                        <td colSpan={4}><b>{opt.key}:</b> {opt.selected}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Box>
            </Group>
          </Card>
        );
      })}

      {/* Order Info */}
      <Title order={5} mt="md" mb="sm">Order Information</Title>
      <Table withBorder striped fontSize="sm" mb="md">
        <tbody>
          <tr>
            <td><b>Order No</b></td>
            <td>{selectedProduct.order_number}</td>
            <td><b>Date</b></td>
            <td>{format(new Date(selectedProduct.createdAt), "DD-MMM-YY")}</td>
          </tr>
          <tr>
            <td><b>Status</b></td>
            <td>{selectedProduct.orderStatus}</td>
            <td><b>Payment</b></td>
            <td>{selectedProduct.paymentStatus ? "Paid" : "Unpaid"}</td>
          </tr>
          <tr>
            <td><b>Payment Method</b></td>
            <td>{selectedProduct.paymentMethod}</td>
            <td><b>Shipping</b></td>
            <td>Rs. {selectedProduct.cart?.shippingCharges}</td>
          </tr>
          <tr>
            <td><b>Net Cost</b></td>
            <td>Rs. {selectedProduct.cart?.netCost}</td>
          </tr>
        </tbody>
      </Table>

      {/* Customer Info */}
      <Title order={5} mt="md" mb="sm">Customer Information</Title>
      <Table withBorder striped fontSize="sm">
        <tbody>
          <tr>
            <td><b>Name</b></td>
            <td>{selectedProduct.name}</td>
            <td><b>Email</b></td>
            <td>{selectedProduct.email}</td>
          </tr>
          <tr>
            <td><b>Phone</b></td>
            <td>{selectedProduct.phone}</td>
            <td><b>Address</b></td>
            <td>{selectedProduct.address}</td>
          </tr>
          <tr>
            <td><b>City</b></td>
            <td>{selectedProduct.city}</td>
            <td><b>Postal Code</b></td>
            <td>{selectedProduct.postalCode}</td>
          </tr>
        </tbody>
      </Table>

    </Box>
  )}
</Modal>

        {/* User Info Header */}
        <Group noWrap sx={{ justifyContent: "space-between", alignItems: "end" }}>
          <Group noWrap>
            <Avatar src={""} size={94} radius="md" />
            <div>
              <Text size="xs" sx={{ textTransform: "uppercase" }} weight={700} color="dimmed">{user?.role || ""}</Text>
              <Text size="lg" weight={500} className={classes.name}>{user?.firstname} {user?.lastname}</Text>
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
               <NavLink
                label="Forgot Password"
                icon={<IconMail size={16} />}
                active={activeTab === "forgotPassword"}
                onClick={() => setActiveTab("forgotPassword")}
              />
            </Box>
          </Grid.Col>

          {/* Content */}
          <Grid.Col sm={4} md={3}>
            <Box sx={{ width: "100%" }}>
              {/* Orders */}
            {/* Orders Table */}
{activeTab === "orders" && (
  <DataTable
    withColumnBorders
    striped
    highlightOnHover
    minHeight="150px"
    page={orders?.data?.page}
    onPageChange={onPagination}
    totalRecords={orders?.data?.totalDocs}
    recordsPerPage={filters.limit}
    idAccessor="_id"
    fontSize="sm"
    records={orders?.data?.docs}
    fetching={isLoading}
    columns={[
      {
        accessor: "_id",
        title: "#",
        textAlignment: "right",
        width: 40,
        render: (record: Order) =>
          orders?.data?.docs.indexOf(record) + 1,
      },
      {
        accessor: "createdAt",
        ellipsis: true,
        width: 100,
        render: (record) => (
          <span>{format(new Date(record.createdAt), "DD-MMM-YY")}</span>
        ),
      },
      { accessor: "order_number", title: "Order No" },
      {
        accessor: "totalQty",
        title: "Qty",
        render: ({ cart }: Order) => <span>{cart.totalQty}</span>,
      },
      {
        accessor: "totalCost",
        title: "Cost",
        render: ({ cart }: Order) => <span>{cart.totalCost}</span>,
      },
      {
        accessor: "discount",
        render: ({ cart }: Order) => <span>{cart.discount}</span>,
      },
      {
        accessor: "netCost",
        render: ({ cart }: Order) => <span>{cart.netCost}</span>,
      },
      { accessor: "orderStatus", width: 200 },
      {
        accessor: "actions",
        title: "View",
        width: 100,
        render: (record) => (
          <ActionIcon
            color="blue"
            onClick={() => viewProductDetails(record)}
          >
            <IconEye size={18} />
          </ActionIcon>
        ),
      },
    ]}



    
  />
)}


{/* Fixed Order Information Section */}





               




              {/* Profile */}
              {activeTab === "profile" && (
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Edit Profile</Title>
                  <form onSubmit={handleProfileUpdate}>
                    <Grid>
                      <Grid.Col md={6}>
                        <TextInput label="First Name" value={profile.firstname} onChange={(e) => setProfile({...profile, firstname: e.target.value})} required />
                      </Grid.Col>
                      <Grid.Col md={6}>
                        <TextInput label="Last Name" value={profile.lastname} onChange={(e) => setProfile({...profile, lastname: e.target.value})} required />
                      </Grid.Col>
                      <Grid.Col md={6}>
                        <TextInput label="Email" value={profile.email} disabled />
                      </Grid.Col>
                      <Grid.Col md={6}>
                        <TextInput label="Role" value={user.role} disabled />
                      </Grid.Col>
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
                      <Grid.Col md={12}>
                        <PasswordInput label="Old Password" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} required />
                      </Grid.Col>
                      <Grid.Col md={12}>
                        <PasswordInput label="New Password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                      </Grid.Col>
                      <Grid.Col md={12}>
                        <PasswordInput label="Confirm New Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} required />
                      </Grid.Col>
                    </Grid>
                    <Button mt="md" type="submit">Update Password</Button>
                  </form>
                </Card>
              )}


{/* OTP Verification & Reset Password */}
{activeTab === "otpReset" && (
  <Card shadow="sm" p="lg">
    <Title order={4} mb="md">Verify OTP & Reset Password</Title>
    <form onSubmit={handleOtpReset}>
      <TextInput
        label="Email"
        placeholder="Enter your email"
        value={otpData.email}
        onChange={(e) => setOtpData({...otpData, email: e.currentTarget.value})}
        required
      />
      <TextInput
        label="OTP"
        placeholder="Enter OTP"
        value={otpData.otp}
        onChange={(e) => setOtpData({...otpData, otp: e.currentTarget.value})}
        required
      />
      <PasswordInput
        label="New Password"
        value={otpData.newPassword}
        onChange={(e) => setOtpData({...otpData, newPassword: e.currentTarget.value})}
        required
      />
      <Button mt="md" type="submit" loading={otpLoading}>Reset Password</Button>
    </form>
  </Card>
)}


 {/* Forgot Password */}
              {activeTab === "forgotPassword" && (
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">
                    Forgot Password
                  </Title>
                  <form onSubmit={handleForgotPassword}>
                    <TextInput
                      label="Email Address"
                      placeholder="Enter your email"
                      icon={<IconMail size={16} />}
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.currentTarget.value)}

                      disabled
                      
                    />
                    <Button mt="md" type="submit" loading={forgotLoading}>
                      Send Reset Link / OTP
                    </Button>
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

export default UserInfo;
