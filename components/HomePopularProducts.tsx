import {
  Box,
  Center,
  Container,
  Loader,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSelector } from "react-redux";
import { publicRequest } from "../requestMethods";
import { ProductCard } from "./ProductCard";

function HomePopularProducts() {
  const { data: products, isFetching } = useQuery({
    queryKey: ["popular-products"],
    queryFn: async () => {
      const res = await publicRequest("/orders/popular-products");
      const data = res.data;
      return data;
    },
  });

  return (
    <Container
      size="lg"
      sx={{ marginBottom: 30, backgroundColor: "white", padding: 20 }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
          Popular Products
        </Text>
        <Link href={`/products?popular=1`}>
          <Text
            size="xs"
            sx={{ lineHeight: 1, marginBottom: 20, color: "#f85606" }}
          >
            See More{">"}
          </Text>
        </Link>
      </Box>

      <SimpleGrid
        breakpoints={[
          { minWidth: 300, cols: 2 },
          { minWidth: "xs", cols: 3 },
          { minWidth: "sm", cols: 4 },
          { minWidth: "md", cols: 6 },
        ]}
      >
        {isFetching ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          products?.data.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </SimpleGrid>
    </Container>
  );
}

export default HomePopularProducts;
