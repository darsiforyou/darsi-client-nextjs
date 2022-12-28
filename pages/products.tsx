import {
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
  let { query } = useRouter();
  const { category_id } = query;
  const [activePage, setPage] = useState(1);
  const [sort, setSort] = useState("RECENT");
  const [_categories, set_Categories] = useState([]);
  const [category, setCategory] = useState(Array.isArray(category_id) ? category_id[0] : category_id || "");
  const { data, isFetching, refetch } = useQuery<ApiResponse<Product>>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await publicRequest.get(
        `/products?page=${activePage}&limit=48&isActive=true&sort=${sort}&category=${category}`
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
    refetch();
  }, [activePage, sort, category]);

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
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
                All Products
              </Text>
              <Box sx={{ display: "flex", gap: 10 }}>
                <Select
                  label="Category"
                  data={_categories}
                  placeholder="Select a category"
                  value={category}
                  onChange={(e: any) => {
                    setCategory(e);
                  }}
                />
                <Select
                  label="Sort By"
                  data={[
                    { label: "Recent", value: "RECENT" },
                    { label: "Price High to low", value: "PRICE_HIGH_TO_LOW" },
                    { label: "Price low to High", value: "PRICE_LOW_TO_HIGH" },
                  ]}
                  value={sort}
                  onChange={(e: any) => {
                    setSort(e);
                  }}
                />
              </Box>
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
