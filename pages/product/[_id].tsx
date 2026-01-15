import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  createStyles,
  Divider,
  Grid,
  Group,
  Image,
  Input,
  Loader,
  Modal,
  ScrollArea,
  Select,
  SimpleGrid,
  Spoiler,
  Table,
  Text,
} from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { showNotification } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { ProductCard } from "../../components/ProductCard";
import { getProducts, get_product } from "../../redux/action/product";
import { addProduct, addProductToCart } from "../../redux/reducers/cartRedux";
import ReactImageMagnify from "react-image-magnify";
import {
  notification_off,
  notification_on,
} from "../../redux/reducers/notificationRedux";
import { useRouter } from "next/router";
import Head from "next/head";

const useStyles = createStyles((theme) => ({
  qtyBox: {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
  },
  qtyText: {
    marginRight: "10px",
  },
  qtyHandler: {
    borderRadius: 0,
    backgroundColor: "#eff0f5",
    color: "grey",
    "&:hover": {
      backgroundColor: "#dadada",
      color: "#fff",
    },
  },
  qtyInput: {
    width: "50px",
    borderRadius: 0,
  },
  options: {
    marginTop: 10,
  },
  optionBox: {
    display: "flex",
    width: "100%",
    padding: "10px 0",
  },
  optionKey: {
    textTransform: "capitalize",
    fontWeight: "bold",
    // flex: 1,
    minWidth: "20%",
    marginRight: "16px",
  },
  optionSelect: {
    // flex: ,
    textalign: "",
    "& .mantine-Select-input": {
      border: "1px solid grey",
    },
  },
}));

function ProductDetail() {
  let router = useRouter();
  const { classes } = useStyles();
  const [loader, setloader] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct]: any = useState({});
  const [productdata, setProductsdata]: any = useState([]);
  const [frontImage, setFrontImage]: any = useState({});
  const [images, setImages]: any = useState([]);
  const { products, isFetching } = useSelector((state: any) => state.product);
  const cart = useSelector((state: any) => state.cart);
  const [qty, setQty] = useState(1);
  const { _id } = router.query;
  const [Disabled, setDisabled]: any = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (product.stockCountPending == 0) {
      setDisabled(true);
    }
  }, [product]);
  const fetchProductDetails = async () => {
    await get_product(_id).then(async ({ data }: any) => {
      setProduct(data);
      let isFront = data.media.find((x: any) => x.isFront === true);
      let otherImages = data.media;
      setFrontImage(isFront);
      setImages(otherImages);
      let productByCat = await getProducts({
        limit: 12,
        category: data.category,
      });
      setProductsdata(productByCat);
      setloader(false);
    });
    let pro = cart.products.find((x: any) => x._id === _id);
    setQty(Number(pro?.quantity || 1));
  };
  useEffect(() => {
    fetchProductDetails();
  }, []);
  useEffect(() => {
    fetchProductDetails();
  }, [_id]);

  if (loader) {
    return (
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader size="xl" variant="bars" />
      </div>
    );
  }
  const rendertag = () => {
    let tags = (product.tags || "").replace(/\s/g, "").split(",");
    if (tags.length <= 0 || tags[0] === "") return null;
    return tags.map((tag: string, i: number) => (
      <Badge
        key={i}
        size="xs"
        variant="filled"
        sx={{ marginLeft: 2, background: "#f85606", color: "white" }}
      >
        {tag}
      </Badge>
    ));
  };
  return (
    <>
      <Head>
        <title>Darsi | {product?.title}</title>
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
          Product Detail
        </Text>
        <Grid columns={3}>
          <Grid.Col xs={3} sm={3} md={1.1}>
            <div style={{ width: 240 }}>
              <ReactImageMagnify
                {...{
                  enlargedImagePosition: "beside",
                  enlargedImageContainerStyle: {
                    position: "absolute",
                    zIndex: 100,
                  },
                  smallImage: {
                    src: frontImage ? frontImage?.imageURL : product?.imageURL,
                    isFluidWidth: true,
                  },
                  largeImage: {
                    src: frontImage ? frontImage?.imageURL : product?.imageURL,
                    width: 1200,
                    height: 1800,
                  },
                }}
              />
              <Box
                component="div"
                sx={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {images.length > 0
                  ? images.map((img: any, i: number) => (
                      <Box
                        key={i}
                        component="span"
                        sx={{
                          position: "relative",
                          padding: 5,
                          border: img.isFront ? "2px solid green" : "none",
                        }}
                        onClick={() => {
                          let _images: any = images || [];
                          _images = _images.map((m: any, m_i: number) => ({
                            ...m,
                            isFront: i === m_i,
                          }));
                          setImages((prev: any) => (prev = _images));
                          setFrontImage(img);
                        }}
                      >
                        <Image
                          key={i}
                          width={65}
                          height={65}
                          fit="cover"
                          src={img?.imageURL}
                        />
                      </Box>
                    ))
                  : null}
              </Box>
              {/* <Image
                  radius="md"
                  src={product?.imageURL}
                  alt="Random unsplash image"
                /> */}
            </div>
          </Grid.Col>
          <Grid.Col xs={3} sm={3} md={1.9}>
            <Text
              weight={600}
              size="xl"
              sx={{
                lineHeight: 1,
                marginBottom: 10,
                textTransform: "capitalize",
              }}
            >
              {product?.title}
            </Text>
            <span>{rendertag()}</span>
            <Text
              weight={600}
              size="xl"
              sx={{ lineHeight: 1, marginBottom: 20, marginTop: 10 }}
            >
              Rs.{product?.price}
            </Text>
            <Box className={classes.qtyBox}>
              <Text size="md" className={classes.qtyText}>
                Quantity
              </Text>
              <Button
                className={classes.qtyHandler}
                onClick={() =>
                  setQty((prev: number) => {
                    if (prev >= 1) return (prev = prev - 1);
                    else return 0;
                  })
                }
              >
                <IconMinus size="20px" />
              </Button>
              <Input
                type="number"
                value={qty}
                onChange={(e: any) => setQty(e.target.value)}
                className={classes.qtyInput}
              />
              <Button
                className={classes.qtyHandler}
                onClick={() => setQty((prev) => (prev = prev + 1))}
              >
                <IconPlus size="20px" />
              </Button>
            </Box>
            <Box className={classes.options}>
              {product.isbn && (
                <Box className={classes.optionBox}>
                  <Text size="md" className={classes.optionKey}>
                    ISBN#:
                  </Text>
                  <Text size="md" className={classes.optionSelect}>
                    {product.isbn}
                  </Text>
                </Box>
              )}
              <Box className={classes.optionBox}>
                <Text size="md" className={classes.optionKey}>
                  Category:
                </Text>
                <Text size="md" className={classes.optionSelect}>
                  {product.category_name}
                </Text>
              </Box>
              <Box className={classes.optionBox}>
                <Text size="md" className={classes.optionKey}>
                  {product.category_name?.toLocaleLowerCase().includes("book")
                    ? "Publisher"
                    : "Brand"}
                  :
                </Text>
                <Text size="md" className={classes.optionSelect}>
                  {product.brand_name}
                </Text>
              </Box>
              {/* <Box className={classes.optionBox}>
                  <Text size="md" className={classes.optionKey}>
                    Vendor:
                  </Text>
                  <Text size="md" className={classes.optionSelect}>
                    {product.vendor_name}
                  </Text>
                </Box> */}
              {(product.options || []).map((option: any, i: number) => (
                <Box className={classes.optionBox} key={i}>
                  <Text size="md" className={classes.optionKey}>
                    {option.key}:
                  </Text>
                  <Select
                    withAsterisk
                    sx={{}}
                    className={classes.optionSelect}
                    placeholder={`Select ${option.key}`}
                    value={option.selected}
                    onChange={(e) => {
                      option.selected = e;
                    }}
                    data={option.values}
                  />
                </Box>
              ))}
            </Box>
            <Button
              className={Disabled && "btnDisable"}
              sx={{
                marginTop: 10,
                backgroundColor: "#f85606",
                "&:hover": {
                  backgroundColor: "#f85606",
                  transform: "scale(1.1)",
                },
              }}
              onClick={() => {
                if (product.stockCountPending > 0) {
                  let isOptionEmpty = false;
                  product.options.forEach((op: any) => {
                    if (!op.selected) {
                      isOptionEmpty = true;
                    }
                  });
                  if (isOptionEmpty) {
                    showNotification({
                      autoClose: 5000,
                      message:
                        "Please Select all options before placing an order.",
                      color: "red",
                    });
                    return;
                  }
                  dispatch(addProductToCart({ ...product, quantity: qty }));
                  setIsModalOpen(true);
                } else {
                  showNotification({
                    autoClose: 5000,
                    message: "Out of Stock",
                    color: "red",
                  });
                }
              }}
            >
              Add to Cart
            </Button>
            {Disabled && (
              <div>
                <h3 className="OutProductText">Currently Unavailable*</h3>
                <p>we dont know when or if this item will be back in stock</p>
              </div>
            )}

            <Spoiler
              maxHeight={120}
              showLabel="Show more"
              hideLabel="Hide"
              sx={{
                lineHeight: 1.8,
                marginBottom: 20,
                fontSize: "14px",
                marginTop: "20px",
              }}
              styles={{
                control: {
                  color: "#f85606",
                },
              }}
            >
              {product?.description?.replace(/(<([^>]+)>)/gi, "")}
            </Spoiler>
          </Grid.Col>
          <Grid.Col lg={3}>
            <Divider my="xl" />
            <Text
              weight={600}
              size="xl"
              sx={{ lineHeight: 1, marginBottom: 20 }}
            >
              You May Also Like
            </Text>
        <SimpleGrid
  breakpoints={[
    { minWidth: 300, cols: 2 },
    { minWidth: "xs", cols: 3 },
    { minWidth: "sm", cols: 4 },
    { minWidth: "md", cols: 6 },
  ]}
>
  {productdata
    ?.filter((product: any) => product.isActive) // ✅ sirf active products
    .map((product: any, i: number) => (
      <div key={i} onClick={() => window.scrollTo(0, 0)}>
        <ProductCard product={product} />
      </div>
    ))}
</SimpleGrid>

          </Grid.Col>
        </Grid>
      </Container>
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${qty} new item(s) have been added to your cart`}
        size="calc(100vw - 20%)"
        centered
      >
        <Grid columns={2}>
          <Grid.Col xs={2} sm={1.3}>
            <Card
              shadow="sm"
              p="sm"
              radius="md"
              withBorder
              sx={{ display: "flex", gap: 10 }}
            >
              <Box sx={{ flex: 0.3 }}>
                <Image
                  src={frontImage?.imageURL}
                  sx={{
                    height: "100% !important",
                    img: {
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    },
                  }}
                  alt="Norway"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Text size="md">{product?.title}</Text>
                <Text size="xl" sx={{ color: "#f85606" }}>
                  Rs.{product?.price}
                </Text>
                <Text size="sm" sx={{ textAlign: "right" }}>
                  Qty: {qty} x Rs.{product?.price * qty}
                </Text>
              </Box>
            </Card>
          </Grid.Col>
          <Grid.Col xs={2} sm={0.7}>
            <Text size="md">
              My Shopping Cart{" "}
              <Text size="sm" component="span">
                ({cart.quantity} item)
              </Text>
            </Text>
            <Card p="sm" radius="md" sx={{ minWidth: "100%", height: "auto" }}>
              <ScrollArea>
                <Table sx={{ minWidth: "100%" }}>
                  <tbody>
                    <tr>
                      <td>Sub Total:</td>
                      <td style={{ textAlign: "right" }}>Rs.{cart.total}</td>
                    </tr>
                    <tr>
                      <td>Total:</td>
                      <td style={{ textAlign: "right" }}>Rs.{cart.total}</td>
                    </tr>
                  </tbody>
                </Table>
              </ScrollArea>
              <Grid columns={2}>
                <Grid.Col xs={1}>
                  <Button
                    sx={{
                      width: "100%",
                      marginTop: 10,
                      backgroundColor: "#f85606",
                      "&:hover": {
                        backgroundColor: "#f85606",
                        transform: "scale(1.1)",
                      },
                      span: {
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    }}
                    onClick={() => {
                      if (product.stockCountPending > 0) {
                        // dispatch(
                        //   addProductToCart({ ...product, quantity: qty })
                        // );
                        setIsModalOpen(false);
                        router.push("/cart");
                      }
                    }}
                  >
                    Go to cart
                  </Button>
                </Grid.Col>
                <Grid.Col xs={1}>
                  <Button
                    sx={{
                      width: "100%",
                      marginTop: 10,
                      backgroundColor: "#f85606",
                      "&:hover": {
                        backgroundColor: "#f85606",
                        transform: "scale(1.1)",
                      },
                      span: {
                        fontSize: 12,
                        fontWeight: 500,
                      },
                    }}
                    onClick={() => {
                      if (product.stockCountPending > 0) {
                        setIsModalOpen(false);
                        // dispatch(
                        //   addProductToCart({ ...product, quantity: qty })
                        // );
                        router.push("/checkout");
                      }
                    }}
                  >
                    Go to checkout
                  </Button>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
}

export default ProductDetail;
