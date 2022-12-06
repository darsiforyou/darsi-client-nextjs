import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Box,
  Autocomplete,
  ActionIcon,
  Divider,
  Text,
  Avatar,
  MantineColor,
  SelectItemProps,
  Loader,
  Indicator,
  UnstyledButton,
  Popover,
  TextInput,
  ScrollArea,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconShoppingCart } from "@tabler/icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { logout } from "../redux/reducers/userRedux";
import { useEffect } from "react";
import { forwardRef } from "react";
import { search_products } from "../redux/action/searchProduct";
import Link from "next/link";
import Image from "next/image";

const HEADER_HEIGHT = 160;
export interface searchedProducts {
  data: Data;
  message: string;
}

export interface Data {
  docs: Doc[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: null;
  page: number;
  pagingCounter: number;
  prevPage: null;
  totalDocs: number;
  totalPages: number;
}

export interface Doc {
  __v: number;
  _id: string;
  available: boolean;
  category: Category[];
  brand: Category[];
  media: any[];
  category_name: string;
  brand_name: string;
  vendor_name: string;
  createdAt: Date;
  createdBy: string;
  description: string;
  imageId: string;
  imageURL: string;
  isActive: boolean;
  isFeatured: boolean;
  price: number;
  productCode: string;
  profitMargin: number;
  stockCountConsumed: number;
  stockCountPending: number;
  title: string;
  totalSale: number;
  updatedAt: Date;
  vendor: Vendor[];
  vendorPrice: number;
}

export interface Category {
  __v: number;
  _id: string;
  createdAt: Date;
  isActive: boolean;
  isFeatured: boolean;
  rank: number;
  title: string;
  updatedAt: Date;
}

export interface Vendor {
  __v: number;
  _id: string;
  createdAt: Date;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  referral_benefit: string;
  referral_package: string;
  referred_by: string;
  role: string;
  totalVendorProductSold: number;
  updatedAt: Date;
  user_code: string;
}

const useStyles: any = createStyles((theme) => ({
  root: {
    position: "sticky",
    zIndex: 1,
    height: 120,
    [theme.fn.smallerThan("sm")]: {
      height: 60,
    },
  },
  topHeader: {
    display: "flex",
    justifyContent: "end",
    alignItems: "center",
    marginTop: 5,
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  bottomHeader: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  searchBottomHeader: {
    ".mantine-Input-icon": {
      right: "0px !important",
      left: "auto !important",
      zIndex: 0,
      backgroundColor: "#f85606",
      color: "white",
    },
    ".mantine-Input-input": {
      paddingLeft: "12px",
    },
  },
  dropdown: {
    position: "absolute",
    top: 120,
    [theme.fn.smallerThan("sm")]: {
      top: 60,
    },
    left: 0,
    right: 0,
    zIndex: 1,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: "hidden",
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
    width: "100%",
    margin: "0 auto",
  },
  logo: {
    width: "90px",
    [theme.fn.smallerThan("sm")]: {
      width: "60px",
    },
  },
  links: {
    flex: 1,
    display: "flex",
    justifyContent: "end",
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
  mobileIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  cartIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },

    [theme.fn.smallerThan("sm")]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
  search: {
    flex: 1,
    ".mantine-Input-icon": {
      right: "0px !important",
      left: "auto !important",
      backgroundColor: "#f85606",
      color: "white",
    },
    ".mantine-Input-input": {
      paddingLeft: "12px",
    },
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
  upperLink: {
    fontSize: 12,
    marginLeft: 20,
    cursor: "pointer",
  },
}));

interface HeaderResponsiveProps {
  links: { link: string; label: string; mobile?: boolean }[];
}
interface ItemProps extends SelectItemProps {
  color: MantineColor;
  description: string;
  imageURL: string;
}

export function HeaderResponsive({ links }: HeaderResponsiveProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const router = useRouter();
  useEffect(() => {
    close();
  }, [router.asPath]);

  const [active, setActive] = useState("Home");
  const [popoverOpened, setPopoverOpened] = useState(false);

  const [searchText, setSearchText] = useState("");
  //const [selectedSearchItem, setselectedSearchItem] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const user = useSelector((state: any) => state.user.currentUser);
  const { searchProducts, isFetching } = useSelector(
    (state: any) => state.searchProduct
  );
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const AutoCompleteItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ id, value, imageURL, ...others }: ItemProps, ref) => {
      return (
        <div key={id} ref={ref} style={{ marginBottom: 10 }}>
          <Link href={`/product/${id}`}>
            <Group noWrap>
              <Avatar src={imageURL} />
              <div>
                <Text>{value}</Text>
              </div>
            </Group>
          </Link>
        </div>
      );
    }
  );

  const items = links.map((item) => (
    <Link
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.label);
      }}
    >
      {item.label}
    </Link>
  ));

  return (
    <>
      <Header height={HEADER_HEIGHT} className={classes.root}>
        <Container size="lg" className={classes.topHeader}>
          <a
            href="https://dashboard-darsi.netlify.app/vendor/signup"
            className={classes.upperLink}
          >
            Become a Vendor
          </a>
          <a
            className={classes.upperLink}
            href="https://dashboard-darsi.netlify.app/ref/signup"
          >
            Signup as Referrer
          </a>
          {!user?._id && (
            <Link className={classes.upperLink} href="/register/Customer">
              Signup
            </Link>
          )}
          {!user?._id ? (
            <Link className={classes.upperLink} href="/login">
              Login
            </Link>
          ) : (
            <>
              <Link className={classes.upperLink} href="/userInfo">
                {user?.firstname + " " + user?.lastname}
              </Link>
              <a
                className={classes.upperLink}
                href="#"
                onClick={() => {
                  dispatch(logout());
                }}
              >
                Logout
              </a>
            </>
          )}
          <Divider my="sm" />
        </Container>
        <Container size="lg">
          <Box className={classes.header}>
            <Box className={classes.logo}>
              <Link href="/">
                <Image src={'/darsi-logo.png'} alt="Logo" width={100} height={100} />
              </Link>
            </Box>
            <Group spacing={5} className={classes.links}>
              <Box
                // sx={{ width: "auto", display: "flex" }}
                className={classes.search}
              >
                <Group sx={{ position: "relative" }}>
                  <Popover
                    opened={popoverOpened}
                    width={"100%"}
                    position="bottom-start"
                    shadow="md"
                    onChange={setPopoverOpened}
                  >
                    <Popover.Target>
                      <TextInput
                        icon={<IconSearch size={18} stroke={1.5} />}
                        size="md"
                        sx={{ width: "100%" }}
                        value={searchText}
                        autoComplete="off"
                        onChange={(event) => {
                          if (searchText.length > 0) {
                            setPopoverOpened(true);
                          } else {
                            setPopoverOpened(false);
                          }
                          setSearchText(event.currentTarget.value);
                          search_products(dispatch, event.currentTarget.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            router.push(`/search/${searchText}`);
                            setPopoverOpened(false);
                          }
                        }}
                        rightSection={
                          <ActionIcon
                            size={40}
                            color="#f85606"
                            variant="filled"
                            onClick={() => {
                              router.push(`/search/${searchText}`);
                              setPopoverOpened(false);
                            }}
                          >
                            {isFetching ? (
                              <Loader color="white" size="md" />
                            ) : (
                              <IconSearch size={16} stroke={1.5} />
                            )}
                          </ActionIcon>
                        }
                        placeholder="Search questions"
                        rightSectionWidth={42}
                        // {...props}
                      />
                    </Popover.Target>
                    <Popover.Dropdown style={{ pointerEvents: "all" }}>
                      {searchProducts.length ? (
                        <Box sx={{ padding: 0 }}>
                          <ScrollArea.Autosize maxHeight={200}>
                            {searchProducts.map((product: any) => (
                              <div
                                key={product.id}
                                style={{ marginBottom: 10 }}
                              >
                                <Link
                                  href={`/product/${product.id}`}
                                  onClick={() => {
                                    setSearchText(product.value);
                                    setPopoverOpened(false);
                                  }}
                                >
                                  <Group noWrap>
                                    <Avatar src={product.imageURL} />
                                    <div>
                                      <Text>{product.value}</Text>
                                    </div>
                                  </Group>
                                </Link>
                              </div>
                            ))}
                          </ScrollArea.Autosize>
                          {/* {searchProducts.length > 10 && ( */}
                          <Center>
                            <Link
                              href={`/search/${searchText}`}
                              onClick={() => {
                                setPopoverOpened(false);
                              }}
                            >
                              <Text>Show More</Text>
                            </Link>
                          </Center>
                          {/* )} */}
                        </Box>
                      ) : (
                        <Center>
                          <Text color={"dimmed"}>Not Found</Text>
                        </Center>
                      )}
                    </Popover.Dropdown>
                  </Popover>
                </Group>
              </Box>

              {items}
              <Indicator
                inline
                label={cart.quantity > 0 && cart.quantity}
                color="orange"
                showZero={false}
                dot={false}
                size={16}
              >
                <Link href="/cart" className={classes.cartIcon}>
                  <IconShoppingCart size={20} style={{ color: "black" }} />
                </Link>
              </Indicator>
            </Group>
            <Box className={classes.mobileIcon}>
              <Burger
                opened={opened}
                onClick={toggle}
                className={classes.burger}
                size="sm"
              />
              <Indicator
                inline
                label={cart.quantity > 0 && cart.quantity}
                color="orange"
                showZero={false}
                dot={false}
              >
                <Link href="/cart" className={classes.cartIcon}>
                  <IconShoppingCart size={20} style={{ color: "black" }} />
                </Link>
              </Indicator>
            </Box>
            <Transition
              transition="pop-top-right"
              duration={200}
              mounted={opened}
            >
              {(styles) => (
                <Paper className={classes.dropdown} withBorder style={styles}>
                  {items}
                  <Link href="/cart" className={cx(classes.link)}>
                    Cart
                  </Link>
                  <Link href="/register/Vendor" className={cx(classes.link)}>
                    Become a Vendor
                  </Link>
                  <Link className={cx(classes.link)} href="/register/Referrer">
                    Signup as Referrer
                  </Link>
                  {!user?._id && (
                    <Link className={cx(classes.link)} href="/register/Customer">
                      Signup
                    </Link>
                  )}
                  {!user?._id ? (
                    <Link className={cx(classes.link)} href="/login">
                      Login
                    </Link>
                  ) : (
                    <>
                      <Link className={cx(classes.link)} href="#">
                        {user?.firstname + " " + user?.lastname}
                      </Link>
                      <a
                        className={cx(classes.link)}
                        href="#"
                        onClick={() => {
                          dispatch(logout());
                        }}
                      >
                        Logout
                      </a>
                    </>
                  )}
                </Paper>
              )}
            </Transition>
          </Box>
        </Container>
      </Header>
      <Container size="lg" className={classes.bottomHeader}>
        <Divider my="sm" />
        <Popover
          opened={popoverOpened}
          width={"100%"}
          position="bottom-start"
          shadow="md"
          onChange={setPopoverOpened}
        >
          <Popover.Target>
            <TextInput
              icon={<IconSearch size={18} stroke={1.5} />}
              size="md"
              sx={{ width: "100%" }}
              value={searchText}
              autoComplete="off"
              onChange={(event) => {
                if (searchText.length > 0) {
                  setPopoverOpened(true);
                } else {
                  setPopoverOpened(false);
                }
                setSearchText(event.currentTarget.value);
                search_products(dispatch, event.currentTarget.value);
              }}
              rightSection={
                <ActionIcon
                  size={40}
                  // color="#f85606"
                  style={{ backgroundColor: "#f85606" }}
                  variant="filled"
                  onClick={() => router.push(`/search/${searchText}`)}
                >
                  {isFetching ? (
                    <Loader color="white" size="md" />
                  ) : (
                    <IconSearch size={16} stroke={1.5} />
                  )}
                </ActionIcon>
              }
              placeholder="Search questions"
              rightSectionWidth={42}
              // {...props}
            />
          </Popover.Target>
          <Popover.Dropdown>
            {searchProducts.length ? (
              <Box sx={{ padding: 0 }}>
                <ScrollArea.Autosize maxHeight={200}>
                  {searchProducts.map((product: any) => (
                    <div key={product.id} style={{ marginBottom: 10 }}>
                      <Link
                        href={`/product/${product.id}`}
                        onClick={() => {
                          setSearchText(product.value);
                          setPopoverOpened(false);
                        }}
                      >
                        <Group noWrap>
                          <Avatar src={product.imageURL} />
                          <div>
                            <Text>{product.value}</Text>
                          </div>
                        </Group>
                      </Link>
                    </div>
                  ))}
                </ScrollArea.Autosize>
                {/* {searchProducts.length > 10 && ( */}
                <Center>
                  <Link
                    href={`/search/${searchText}`}
                    onClick={() => {
                      setPopoverOpened(false);
                    }}
                  >
                    <Text>Show More</Text>
                  </Link>
                </Center>
                {/* )} */}
              </Box>
            ) : (
              <Center>
                <Text color={"dimmed"}>Not Found</Text>
              </Center>
            )}
          </Popover.Dropdown>
        </Popover>
      </Container>
    </>
  );
}
