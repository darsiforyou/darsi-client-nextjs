import {
  Container,
  Grid,
  LoadingOverlay,
  Pagination,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard";
import { publicRequest } from "../../requestMethods";
import { ApiResponse, Product } from "../../types/types";

export default function Search() {
  let router = useRouter();
  const { query } = router.query
  const [activePage, setPage] = useState(1);
  const { data, isFetching, refetch } = useQuery<ApiResponse<Product>>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await publicRequest.get(
        `/products?search=${query}&page=${activePage}&limit=50&isActive=true`
      );
      const data = res.data;
      return data;
    },
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    refetch();
  }, [query, activePage]);

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
            <Text size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
              Search Result for <b>"{query}"</b>
            </Text>
            <Text>
              {data?.data.totalDocs} items found for "{query}"
            </Text>
            <Grid columns={3}>
              <Grid.Col xs={3} sm={3} md={3} lg={3}>
                <SimpleGrid
                  breakpoints={[
                    // { minWidth: 300, cols: 2 },
                    // { minWidth: "xs", cols: 3 },
                    // { minWidth: "sm", cols: 4 },
                    // { minWidth: "md", cols: 4 },
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
              {/* <Grid.Col xs={3} sm={3} md={1} lg={1}>
          <Card
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            sx={{ minWidth: "100%", height: "100%", background: "#F5F5F5" }}
          >
            <Text
              weight={600}
              size="md"
              sx={{ lineHeight: 1, marginBottom: 20 }}
            >
              Categories
            </Text>
            <Box>
              {!catIsFetching &&
                categories?.map((category: any, i: number) =>
                  category.products > 0 ? (
                    <Checkbox
                      checked={selectedCategories.some(
                        (cat: any) => cat._id === category._id
                      )}
                      key={i}
                      sx={{ marginBottom: 4 }}
                      label={category.title}
                      onChange={async (e) => {
                        let prev: any[] = selectedCategories;
                        if (e.currentTarget.checked) {
                          if (prev.includes(category)) return;
                          prev.push(category);
                        } else {
                          prev = prev.filter(
                            (p: any) => p._id !== category._id
                          );
                        }
                        await setselectedCategories(prev);
                        filterProducts(prev);
                      }}
                    />
                  ) : null
                )}
            </Box>
          </Card>
        </Grid.Col> */}
            </Grid>
          </>
        ) : (
          <LoadingOverlay visible={isFetching} overlayBlur={2} />
        )}
      </Container>
    </>
  );
}
