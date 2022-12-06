import {
  Box,
  Card,
  Checkbox,
  Container,
  Grid,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductCard } from "../components/ProductCard";
import { get_products } from "../redux/action/product";

function Products() {
  const dispatch = useDispatch();
  let router = useRouter();
  
  //let { query } = useParams();
  const [scroll, scrollTo] = useWindowScroll();

  const search = new URLSearchParams("");
  const {query} = router
  const [selectedCategories, setselectedCategories]: any[] = useState([]);
  const [selectedProducts, setselectedProducts]: any[] = useState([]);
  const { products, isFetching } = useSelector((state: any) => state.product);
  const { categories, isFetching: catIsFetching } = useSelector(
    (state: any) => state.category
  );
  useEffect(() => {
    let cat: any[] = [];
    scrollTo({ y: 0 });

    if (query["category_id"]) {
      cat = categories.filter((x: any) => x._id === search.get("category_id"));
      // scrollTo({ y: 0 });
      // window.scrollTo(0, 0);
      setselectedCategories((prev: any) => (prev = cat));
    }
    get_products(dispatch);
    filterProducts(cat);
  }, [query]);

  const filterProducts = (categories: any[] = []) => {
    let pro: any = [];
    if (categories.length > 0) {
      products.forEach((product: any) => {
        let isCat = categories.some((cat: any) => cat._id === product.category);
        if (isCat) {
          pro.push(product);
        }
      });
    } else {
      pro = [...products];
    }
    if (search.get("popular")) {
      pro = pro.sort((a: any, b: any) =>
        a.stockCountConsumed < b.stockCountConsumed ? 1 : -1
      );
      console.log(pro);
    }
    setselectedProducts(pro);
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
      <Text weight={600} size="xl" sx={{ lineHeight: 1, marginBottom: 20 }}>
        All Products
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
              { minWidth: "md", cols: 5 },
            ]}
          >
            {selectedProducts.length > 0 ? (
              selectedProducts?.map((product: any, i: number) => (
                <div key={i}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <Text
                weight={600}
                size="md"
                sx={{ lineHeight: 1, marginBottom: 20, textAlign: "center" }}
              >
                No Products Found
              </Text>
            )}
          </SimpleGrid>
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
    </Container>
  );
}

export default Products;
