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
  Center,
  Table,
  Card,
} from "@mantine/core";
import { IconPhoneCall, IconAt, IconCode, IconEye } from "@tabler/icons";
import { Badge, Box, NavLink } from "@mantine/core";
import { IconChevronRight, IconActivity } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { publicRequest } from "../requestMethods";
import { format } from "fecha";
import { Order } from "../types/types";
import Head from "next/head";
import { useRouter } from "next/router";

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

const fetchOrderByUser = async ({ queryKey }: any) => {
  const [_, { search, page, limit, ...filters }] = queryKey;
  const params = new URLSearchParams(filters);
  const res: AxiosResponse = await publicRequest.get(
    `/orders?search=${search}&page=${page}&limit=${limit}&${params}`
  );
  const data = res.data;
  return data;
};
function UserInfo() {




const user = useSelector((state: any) => state.user.currentUser);
const router = useRouter();

// redirect if user is not logged in
useEffect(() => {
  if (!user) {
    router.push("/login");
  }
}, [user]);
 
   //view model state
   const [viewModalOpened, setViewModalOpened] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<any>(null);

  
  const viewProductDetails = (record: any) => {
   setSelectedProduct(record);
   setViewModalOpened(true);
};






  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { classes } = useStyles();
  
  const [filters, setfilters] = useState({
    search: "",
    limit: 10,
    page: 1,
    user: user?._id || "",
  });
  const {
    isLoading,
    error,
    data: orders,
    refetch,
  } = useQuery(["orders", filters], fetchOrderByUser, {
    enabled: true,
    refetchOnWindowFocus: false,
  });
  const onPagination = async (event: any) => {
    await setfilters((prev: any) => ({
      ...prev,
      page: event,
    }));
    await refetch();
  };
  return (
    <>
      <Head>
        <title>Darsi | User Profile</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container
        size="lg"
        sx={{
          marginBottom: 30,
          marginTop: 30,
          backgroundColor: "white",
          padding: 20,
        }}
      >



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




        <Group noWrap sx={{ justifyContent: "space-between", alignItems: "end" }}>
          <Group noWrap>
            <Avatar src={""} size={94} radius="md" />
            <div>
              <Text
                size="xs"
                sx={{ textTransform: "uppercase" }}
                weight={700}
                color="dimmed"
              >
                {user?.role || ''}
              </Text>

              <Text size="lg" weight={500} className={classes.name}>
                {user?.firstname || ''} {user?.lastname || ''}
              </Text>

              <Group noWrap spacing={10} mt={3}>
                <IconAt stroke={1.5} size={16} className={classes.icon} />
                <Text size="xs" color="dimmed">
                  {user?.email || ''}
                </Text>
              </Group>

              {/* <Group noWrap spacing={10} mt={5}>
                <IconCode stroke={1.5} size={16} className={classes.icon} />
                <Text size="xs" color="dimmed">
                  {user.user_code}
                </Text>
              </Group> */}
            </div>
          </Group>
          {/* <Button radius="xl" size="xs">
          Edit
        </Button> */}
        </Group>
        <Divider my={20} />
        <Grid columns={4} sx={{ alignItems: "start" }}>
          <Grid.Col sm={4} md={1}>
            <Box sx={{ width: "100%" }}>
              <NavLink
                label="My Orders"
                icon={<IconActivity size={16} stroke={1.5} />}
                rightSection={<IconChevronRight size={12} stroke={1.5} />}
                active
              />
            </Box>
          </Grid.Col>
          <Grid.Col sm={4} md={3}>
            <Box sx={{ width: "100%" }}>
              <DataTable
                withColumnBorders
                striped
                highlightOnHover
                minHeight={"150px"}
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
                      <span>
                        {format(new Date(record.createdAt), "DD-MMM-YY")}
                      </span>
                    ),
                  },
                  { accessor: "name", width: 150, hidden: user?.role !== "Admin" },
                  {
                    accessor: "email",
                    width: 150,
                    hidden: user?.role !== "Admin",
                    ellipsis: true,
                  },
                  {
                    accessor: "phone",
                    width: 100,
                    hidden: user?.role !== "Admin",
                  },
                  {
                    accessor: "order_number",
                    title: "Order No",
                  },
                  {
                    accessor: "totalQty",
                    title: "Qty",
                    render: ({ cart }: Order, index) => (
                      <span>{cart.totalQty}</span>
                    ),
                  },
                  {
                    accessor: "totalCost",
                    title: "Cost",
                    render: ({ cart }: Order, index) => (
                      <span>{cart.totalCost}</span>
                    ),
                  },
                  {
                    accessor: "discount",
                    render: ({ cart }: Order, index) => (
                      <span>{cart.discount}</span>
                    ),
                  },
                  {
                    accessor: "netCost",
                    render: ({ cart }: Order, index) => (
                      <span>{cart.netCost}</span>
                    ),
                  },

                  {
                    accessor: "city",
                    hidden: user?.role !== "Admin",
                    render: (record: Order, index) => <span>{record.city}</span>,
                  },
                  {
                    accessor: "orderStatus",
                    width: 200,
                  },

                  {
               accessor: "actions",
               title: "view",
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
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default UserInfo;
