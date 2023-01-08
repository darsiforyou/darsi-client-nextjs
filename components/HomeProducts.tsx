import { Box, Container, Grid, SimpleGrid, Text } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProducts } from "../redux/action/product";
import { ProductCard } from "./ProductCard";

function HomeProducts({ cat }: any) {
  // const { products, isFetching: isFetchingProduct } = useSelector(
  //   (state: any) => state.product
  // );
  const [products, setProducts] = useState([]);
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    let data = await getProducts({ limit: 12, category: cat._id });
    setProducts(data);
  };
  const getCatProducts = (id: string) => {
    let productByCat = products.filter((x: any) => x.category === id);
    return productByCat;
  };
  if ((products || []).length === 0) {
    return null;
  }

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
        <Link href={`/products?category_id=${cat._id}`}>
          <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
            {cat.title}
          </Text>
        </Link>
        <Link href={`/products?category_id=${cat._id}`}>
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
        {(products || []).map((product: any, i: number) => (
          <div key={i}>
            <ProductCard product={product} />
          </div>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default HomeProducts;
