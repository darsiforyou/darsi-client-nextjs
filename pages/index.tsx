import Head from "next/head";
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
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Head>
        <title>Darsi | Home</title>
        <link rel="shortcut icon" href="/darsi-logo.png" />

        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Banner />
      <HomeCategory />
      <HomePopularProducts />
      {!isFetching &&
        categories.map((cat: any) => (
          <div key={cat._id}>
            <HomeProducts cat={cat} />
          </div>
        ))}
    </>
  );
}

export default Home;
