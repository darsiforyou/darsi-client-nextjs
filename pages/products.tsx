import {
  Accordion,
  Box,
  Container,
  Grid,
  LoadingOverlay,
  Pagination,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProductCard } from "../components/ProductCard";
import { publicRequest } from "../requestMethods";
import { ApiResponse, Product } from "../types/types";

export default function Search() {
  const router = useRouter();
  let { query } = useRouter();
  const { category_id, page: initialPage } = query; // Retrieve the page value from the URL query parameters
  const [activePage, setPage] = useState(Number(initialPage) || 1); // Use the retrieved page value or default to 1
  const [sort, setSort] = useState("RECENT");
  const [brand, setBrand] = useState("");
  const [_categories, set_Categories] = useState([]);
  const [category, setCategory] = useState(
    Array.isArray(category_id) ? category_id[0] : category_id || ""
  );
  const { data: brands, isFetching: isFetchingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      // const res = await publicRequest.get(`/brands?limit=1000`);
      // const data = res.data.data.docs;
      // const brands = data.map((brand: any) => ({
      //   value: brand._id,
      //   label: brand.title,
      // }));
      // return brands;

        const res = await publicRequest.get(`/brands?limit=1000`);
        const data = res.data.data.docs;

        console.log(data);
        
        //first condition apply  brand.isActive==true
        //2nd  transform data 
       const brands = data
      .filter((brand: any) => brand.isActive === true)
      .map((brand: any) => ({
       value: brand._id,
      label: brand.title,
     }))
  .sort((a: any, b: any) => a.label.localeCompare(b.label)); // <-- Alphabetical sort
  //soring apply a to z

return brands;


      
    },
  });

  const [filters, setFilters] = useState({
    page: activePage,
    sort: sort,
    category: category,
    brand: brand,
    targetAge: "",
  });
  const { data, isFetching, refetch } = useQuery<ApiResponse<Product>>({
    queryKey: ["products", filters],
    queryFn: async ({ queryKey }: any) => {
      const [_, { page, sort, category, brand, targetAge, ...filters }] =
        queryKey;
      const params = new URLSearchParams(filters);
      const res = await publicRequest.get(
        `/products?page=${activePage}&limit=48&isActive=true&sort=${sort}&category=${category}&brand=${brand}&targetAge=${targetAge}`
      );
      const data = res.data;
      return data;
    },
    refetchOnWindowFocus: false,
  });
  const { categories } = useSelector((state: any) => state.category);
  useEffect(() => {
    let cats: any = [{ label: "All", value: "" }];
    categories.forEach((cat: any) => {
      cats.push({
        label: cat.title,
        value: cat._id,
      });
    });
    set_Categories(cats);
  }, [categories]);
  useEffect(() => {
    if (query) {
      setFilters((prev) => ({ ...prev, category }));
    }
    refetch();
  }, [activePage, sort, category, query]);

  useEffect(() => {
    // Update the URL query parameter with the activePage value
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, page: activePage },
      },
      undefined,
      { shallow: true }
    );
  }, [activePage]);


  return (
    <>
      <Head>
        <title>Darsi | Product Search</title>
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
        {!isFetching ? (
          <>
            <Box
            // sx={{
            //   display: "flex",
            //   justifyContent: "space-between",
            //   marginBottom: 10,
            // }}
            >
              <Text size="xl">All Products</Text>
              <Accordion defaultValue="Filters">
                <Accordion.Item value="Filters">
                  <Accordion.Control>Filters</Accordion.Control>
                  <Accordion.Panel>
                    <SimpleGrid
                      cols={4}
                      mb="lg"
                      breakpoints={[{ maxWidth: 700, cols: 2 }]}
                    >
                      <Select
                        label="Age"
                        data={[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                        ]}
                        placeholder="Select age"
                        value={filters.targetAge}
                        clearable
                        onChange={(e: any) => {
                          setFilters((prev) => ({
                            ...prev,
                            page: 1,
                            targetAge: e,
                          }));
                        }}
                      />
                      <Select
                        label="Category"
                        data={_categories}
                        placeholder="Select a category"
                        value={filters.category}
                        onChange={(e: any) => {
                          setFilters((prev) => ({
                            ...prev,
                            page: 1,
                            category: e,
                          }));
                        }}
                      />
                      <Select
                        label="Sort By"
                        data={[
                          { label: "Recent", value: "RECENT" },
                          {
                            label: "Price High to low",
                            value: "PRICE_HIGH_TO_LOW",
                          },
                          {
                            label: "Price low to High",
                            value: "PRICE_LOW_TO_HIGH",
                          },
                        ]}
                        value={filters.sort}
                        onChange={(e: any) => {
                          setFilters((prev) => ({ ...prev, page: 1, sort: e }));
                        }}
                      />
                      <Select
                        label="Brands"
                        data={[{ label: "All", value: "" }, ...brands]}
                        value={filters.brand}
                        placeholder="Select Brand"
                        clearable
                        onChange={(e: any) => {
                          setFilters((prev) => ({
                            ...prev,
                            page: 1,
                            brand: e,
                          }));
                        }}
                      />
                    </SimpleGrid>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Box>
            <Grid columns={3}>
              <Grid.Col xs={3} sm={3} md={3} lg={3}>
                <SimpleGrid
                  breakpoints={[
                    { minWidth: 300, cols: 2 },
                    { minWidth: "xs", cols: 3 },
                    { minWidth: "sm", cols: 4 },
                    { minWidth: "md", cols: 6 },
                  ]}
                >
                  {data?.data.docs.length ? (
                    <>
                      {data?.data.docs?.map((product: any, i: number) => (
                        <div key={i}>
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </>
                  ) : (
                    <Text
                      weight={600}
                      size="md"
                      sx={{
                        lineHeight: 1,
                        marginBottom: 20,
                        textAlign: "center",
                      }}
                    >
                      No Products Found
                    </Text>
                  )}
                </SimpleGrid>
                {data?.data?.totalPages && data?.data?.totalPages > 1 && (
                  <Pagination
                    page={activePage}
                    onChange={setPage}
                    total={data?.data.totalPages}
                    position="center"
                    mt={"xl"}
                    styles={(theme) => ({
                      item: {
                        "&[data-active]": {
                          backgroundColor: "#f85606",
                        },
                      },
                    })}
                  />
                )}
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <LoadingOverlay visible={isFetching} overlayBlur={2} />
        )}
      </Container>
    </>
  );
}
