import { Box, Container, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ProductCard } from "./ProductCard";

function HomePopularProducts() {
  const { p_products, isFetching } = useSelector(
    (state: any) => state.popularProduct
  );
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
        {!isFetching &&
          p_products?.map((product: any, i: number) => (
            <div key={i}>
              <ProductCard product={product} />
            </div>
          ))}
      </SimpleGrid>
    </Container>
  );
}

export default HomePopularProducts;
