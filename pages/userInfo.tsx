import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createStyles,
  Avatar,
  Text,
  Group,
  Container,
  Button,
  Divider,
  Grid,
} from "@mantine/core";
import { IconPhoneCall, IconAt, IconCode } from "@tabler/icons";
import { Badge, Box, NavLink } from "@mantine/core";
import { IconChevronRight, IconActivity } from "@tabler/icons";
import { DataTable } from "mantine-datatable";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { publicRequest } from "../requestMethods";
import { format } from "fecha";
import { Order } from "../types/types";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { classes } = useStyles();
  const user = useSelector((state: any) => state.user.currentUser);
  const [filters, setfilters] = useState({
    search: "",
    limit: 10,
    page: 1,
    user: user._id,
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
    <Container
      size="lg"
      sx={{
        marginBottom: 30,
        marginTop: 30,
        backgroundColor: "white",
        padding: 20,
      }}
    >
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
              {user.role}
            </Text>

            <Text size="lg" weight={500} className={classes.name}>
              {user.firstname} {user.lastname}
            </Text>

            <Group noWrap spacing={10} mt={3}>
              <IconAt stroke={1.5} size={16} className={classes.icon} />
              <Text size="xs" color="dimmed">
                {user.email}
              </Text>
            </Group>

            <Group noWrap spacing={10} mt={5}>
              <IconCode stroke={1.5} size={16} className={classes.icon} />
              <Text size="xs" color="dimmed">
                {user.user_code}
              </Text>
            </Group>
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
                { accessor: "name", width: 150, hidden: user.role !== "Admin" },
                {
                  accessor: "email",
                  width: 150,
                  hidden: user.role !== "Admin",
                  ellipsis: true,
                },
                {
                  accessor: "phone",
                  width: 100,
                  hidden: user.role !== "Admin",
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
                  hidden: user.role !== "Admin",
                  render: (record: Order, index) => <span>{record.city}</span>,
                },
                {
                  accessor: "orderStatus",
                  width: 200,
                },
              ]}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default UserInfo;
