import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Banner } from "../components/Banner";
import { HomeCategory } from "../components/HomeCategory";
import HomePopularProducts from "../components/HomePopularProducts";
import HomeProducts from "../components/HomeProducts";

function Home() {
  const { categories, isFetching } = useSelector(
    (state: any) => state.category
  );
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <Banner />
      <HomeCategory />
      <HomePopularProducts />
      {
        !isFetching && categories.map((cat: any) => (
          <div key={cat._id}>
            <HomeProducts cat={cat} />
          </div>
        ))
      }
    </>
  );
}

export default Home;
