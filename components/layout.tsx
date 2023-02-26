import { Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get_categories } from "../redux/action/category";
import { get_popular_products } from "../redux/action/popularProduct";
import { get_products } from "../redux/action/product";
import { FooterLinks } from "./Footer";
import { HeaderResponsive } from "./Header";

function Layout({ children }: any) {
  const dispatch = useDispatch();
  const [loader, setloader] = useState(true);
  const notification = useSelector((state: any) => state.notification);

  useEffect(() => {
    const fetchData = async () => {
      await get_categories(dispatch);
      // await get_products(dispatch);
      await get_popular_products(dispatch);

      setloader(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    notification.isOpen &&
      showNotification({
        icon:
          notification.type === "Success" ? (
            <IconCheck size={16} />
          ) : (
            <IconAlertCircle size={16} />
          ),
        message: notification.message,
        title: notification.type,
        color: notification.type === "Success" ? "lime" : "red",
      });
  }, [notification.isOpen]);

  // if (loader) {
  //   return (
  //     <div
  //       style={{
  //         minHeight: "100vh",
  //         width: "100%",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Loader size="xl" variant="bars" />
  //     </div>
  //   );
  // }
  return (
    <>
      <HeaderResponsive
        links={[
          { label: "Home", link: "/" },
          { label: "Products", link: "/products" },
          { label: "Packages", link: "/packages" },
        ]}
      />
      {children}
      <FooterLinks
        links={[
          { label: "Home", link: "/" },
          { label: "Products", link: "/products" },
          { label: "Packages", link: "/packages" },
          { label: "Contact us", link: "/contact-us" },
          { label: "Privacy Policy", link: "/pp" },
          { label: "Refund Policy", link: "/refundPolicy" },
          { label: "Terms and conditions", link: "/terms" },
        ]}
      />
    </>
  );
}

export default Layout;
