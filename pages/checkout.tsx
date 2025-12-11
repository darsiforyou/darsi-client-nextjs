import {
  Box,
  Button,
  Card,
  Container,
  createStyles,
  Grid,
  LoadingOverlay,
  Modal,
  Radio,
  ScrollArea,
  Select,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CITIES from "../assets/cities.json";
import { createOrder } from "../redux/action/create_order";
import { apply_discount_code } from "../redux/action/discount_code";
import { clear_cart } from "../redux/reducers/cartRedux";
import { publicRequest } from "../requestMethods";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));
const useStylesDiscountInput = createStyles((theme) => ({
  root: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 18,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: theme.spacing.sm / 2,
    zIndex: 1,
  },
}));
interface TableScrollAreaProps {
  data: { name: string; email: string; company: string }[];
}
function Cart() {
  const router = useRouter();
  const { classes: classesDiscountInput } = useStylesDiscountInput();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cartData, setCartData] = useState(false);
  const [shippingAmount, setShippingAmount] = useState(0);
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const user = useSelector((state: any) => state.user.currentUser);
  const cart = useSelector((state: any) => state.cart);
  const [stripeToken, setStripeToken] = useState(null);
  const [code, setCode] = useState("");
  const [_package, setPackage]: any = useState({});
  const dispatch = useDispatch();
  const bankSurCharges =
    ((cart.total + shippingAmount - cart.discount) * 2.75) / 100;
  const taxPaypro = Number((bankSurCharges * 13) / 100);
  const totalTax = Math.round(Number(bankSurCharges + taxPaypro));
  const paybale = Math.round(
    Number(cart.total + shippingAmount - cart.discount + totalTax)
  );
  const calculateDiscount = (): number => {
    // if(cart.discount){
    //   return cart.discount
    // }
    let total = Number(cart.total);
    let vendorTotal = Number(cart.vendorTotal);
    let profit = total - vendorTotal;
    let discount_percentage = Number(_package?.discount_percentage | 0);
    let netAmount = (profit * discount_percentage) / 100;
    if (cart.discount) {
      netAmount = cart.discount;
    }
    return netAmount;
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    calculateDiscount();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    calculateDiscount();
  }, [cart]);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      phone: "",
      city: "Karachi",
      postalCode: "",
      address: "",
    },
    validate: {
      email: (value) =>
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-z]+)$/.test(value)
          ? null
          : "Invalid email",
      phone: (value) =>
        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(
          value
        )
          ? null
          : "Invalid phone number",
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
      postalCode: (value) => (!value ? "Postal code is required" : null),
      city: (value) => (!value ? "City is required" : null),
      address: (value) => (!value ? "Address is required" : null),
    },
  });
  const { data: shipping } = useQuery({
    queryKey: ["shipping"],
    queryFn: async () => {
      const res = await publicRequest("/shippings");
      const data = res.data.data[0];
      return data;
    },
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    if (shipping) {
      if (form.values.city === "Karachi") {
        setShippingAmount(shipping.inCity);
      } else {
        setShippingAmount(shipping.outCity);
      }
    }
    calculateDiscount();
  }, [form.values.city, shipping]);
  const [loadingCheckout, setloadingCheckout] = useState(false);
  const handleConfirmCart = () => {
    setloadingCheckout(true);
    createOrder(cartData)
      .then((res: any) => {
        setloadingCheckout(false);
        if (res.status === 200) {
          if (res.data.paymentToken) {
            window.location.replace(res.data.paymentToken);
          } else {
            dispatch(clear_cart());
            router.push("/");
            showNotification({
              autoClose: 5000,
              message: res.data?.message,
              color: "green",
            });
          }
        }
      })
      .catch((error: any) => {
        setloadingCheckout(false);
        showNotification({
          autoClose: 5000,
          message: "Something went wrong!",
          color: "red",
        });
      });
    setIsModalOpen(false);
  };
  const handleSubmit = async (values: any) => {
    setIsModalOpen(true);
    let cartData: any = {};
    cartData.products = cart.products.map((x: any) => ({
      productId: x._id,
      vendor: x.vendor,
      title: x.title,
     
      productCode: x.productCode,
      profitMargin: x.profitMargin * x.quantity,
      price: x.price,
      vendorPrice: x.vendorPrice,
      qty: x.quantity,
      stockCountPending: x.stockCountPending,
      stockCountConsumed: x.stockCountConsumed,
      totalSale: x.totalSale,
      options:
        x.options && x.options.length
          ? x.options.map((op: any) => ({ key: op.key, selected: op.selected }))
          : undefined,
    }));
    if (cart.code) {
      cartData.applied_Referral_Code = cart.code;
    }
    if (user) {
      cartData.user = user._id;
    }
    cartData.name = values.firstname + " " + values.lastname;
    cartData.email = values.email;
    cartData.address = values.address;
    cartData.city = values.city;
    cartData.postalCode = values.postalCode;
    cartData.phone = values.phone;
    cartData.paymentMethod = paymentMethod;

    cartData.shippingCharges =
      form.values.city === "Karachi" ? shipping?.inCity : shipping?.outCity;
    setCartData(cartData);
  };
  return (
    <>
      <Head>
        <title>Darsi | Checkout</title>
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
        <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
          Billing Information
        </Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid columns={3}>
            <Grid.Col xs={3} sm={3} md={2} lg={2}>
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
                placeholder="Enter Your Email"
                {...form.getInputProps("email")}
              />
              <TextInput
                withAsterisk
                label="Phone"
                placeholder="Enter Your Phone"
                {...form.getInputProps("phone")}
              />
              <Select
                withAsterisk
                label="City"
                placeholder="Enter Your City"
                searchable
                data={CITIES}
                {...form.getInputProps("city")}
              />
              <TextInput
                withAsterisk
                label="Postcode / Zip"
                placeholder="Enter Your Postcode / Zip"
                {...form.getInputProps("postalCode")}
              />
              <TextInput
                withAsterisk
                label="Street address"
                placeholder="Enter Your Street address"
                {...form.getInputProps("address")}
              />
            </Grid.Col>
            <Grid.Col xs={3} sm={3} md={1} lg={1}>
              <Card
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                sx={{ minWidth: "100%", height: "100%", background: "#F5F5F5" }}
              >
                <ScrollArea
                  sx={{ height: 300 }}
                  onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
                >
                  <Table sx={{ minWidth: "100%" }}>
                    <thead>
                      <tr>
                        <th colSpan={2}>Order Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Sub Total:</td>
                        <td>Rs.{cart.total}</td>
                      </tr>
                      <tr>
                        <td>Shipping:</td>
                        <td>
                          Rs.{" "}
                          {form.values.city
                            ? form.values.city === "Karachi"
                              ? shipping?.inCity
                              : shipping?.outCity
                            : 0}
                        </td>
                      </tr>
                      <tr>
                        <td>Discount:</td>
                        <td>Rs.{calculateDiscount()}</td>
                      </tr>
                      <tr>
                        <td>Total:</td>
                        <td>
                          Rs.
                          {(form.values.city === "Karachi"
                            ? shipping?.inCity
                            : shipping?.outCity) +
                            (cart.total - calculateDiscount())}
                        </td>
                      </tr>
                      {paymentMethod === "PAYPRO" && (
                        <>
                          <tr>
                            <td>Bank Charges</td>
                            {/* 2.75% charges hai paypro or 13% hai Fedreal sindh tex on apllicable of 2.75% value */}
                            <td>{totalTax}</td>
                          </tr>
                          <tr>
                            <td>FBR Charges</td>
                            {/* 2.75% charges hai paypro or 13% hai Fedreal sindh tex on apllicable of 2.75% value */}
                            <td>1</td>
                          </tr>
                          <tr>
                            <td>Payable</td>

                            <td>{paybale + 1}</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </Table>
                </ScrollArea>




                {/* //payment gateway options */}
                {/* <Box mb={10}>
                  <Radio.Group
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    name="paymentMethod"
                    label="Payment Method"
                    withAsterisk
                    spacing="xs"
                    orientation="vertical"
                  >
                    <Radio value="COD" label="Cash on Delivery" />
                    <Radio
                      value="PAYPRO"
                      label="Card Payment / Easypaisa / Jazz Cash"
                    />
                  </Radio.Group>
                </Box> */}
                {!cart.code && (
                  <>
                    <TextInput
                      disabled={
                        cart.products.length === 0 ||
                        (cart.discount && cart.products.length >= 0)
                      }
                      label="Referral Code"
                      placeholder="Enter code to get discount"
                      classNames={classesDiscountInput}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />

                    <Button
                      disabled={
                        !code || (cart.discount && cart.products.length >= 0)
                      }
                      variant="light"
                      sx={{ marginTop: 10, width: "100%" }}
                      color="indigo"
                      onClick={() =>
                        apply_discount_code(dispatch, code)
                          .then((res: any) => {
                            setPackage(res);
                            showNotification({
                              autoClose: 5000,
                              message: "Discount applied",
                              color: "red",
                            });
                          })
                          .catch((err) => {
                            showNotification({
                              autoClose: 5000,
                              message: "Something went wrong!",
                              color: "red",
                            });
                          })
                      }
                    >
                      Apply Code
                    </Button>
                  </>
                )}
                <Button
                  sx={{
                    marginTop: 10,
                    width: "100%",
                    backgroundColor: "#f85606",
                    "&:hover": { backgroundColor: "#f85606" },
                  }}
                  type="submit"
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Grid.Col>
          </Grid>
        </form>
      </Container>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          paymentMethod === "COD"
            ? `You can pay in cash to our courier when you receive the goods at your doorstep.`
            : "You will be redirected to paypro to pay your amount"
        }
        size="sm"
        centered
      >
        <Button
          sx={{
            marginTop: 10,
            width: "100%",
            backgroundColor: "#f85606",
            "&:hover": { backgroundColor: "#f85606" },
          }}
          onClick={handleConfirmCart}
        >
          CONFIRM ORDER
        </Button>
      </Modal>
      <LoadingOverlay visible={loadingCheckout} overlayBlur={2} />
    </>
  );
}

export default Cart;
