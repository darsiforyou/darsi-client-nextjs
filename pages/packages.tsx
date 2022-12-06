import { Container, Grid, Text } from "@mantine/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackageCard } from "../components/PackageCard";
import { get_packages } from "../redux/action/packages";

function Products() {
  const dispatch = useDispatch();
  const type = ["", "basic", "standard", "ultimite"];
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    get_packages(dispatch);
  }, []);
  const { packages, isFetching } = useSelector((state: any) => state.package);
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
        All Packages
      </Text>
      <Grid columns={3}>
        {!isFetching &&
          packages?.map((pac: any) => (
            <Grid.Col key={pac._id} xs={3} sm={1.5} md={1.5} lg={1}>
              <PackageCard pac={pac} />
            </Grid.Col>
          ))}
      </Grid>
    </Container>
  );
}

export default Products;
