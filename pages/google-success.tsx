import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "@mantine/notifications";
import { loginSuccess } from "../redux/reducers/userRedux";

export default function GoogleSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!router.isReady) return;

    // This token is already your backend JWT sent from /google/callback
    const backendToken = router.query.token as string;

    if (!backendToken) {
      showNotification({ message: "No token found! Please login manually.", color: "red" });
      router.replace("/login");
      return;
    }

    try {
      // Decode backend JWT to extract user info
      const payload = JSON.parse(atob(backendToken.split(".")[1]));

      const user = {
        _id: payload.id,
        email: payload.email,
        firstname: payload.firstname || "",
        lastname: payload.lastname || "",
        role: payload.role,
        accessToken: backendToken, // ✅ Save backend JWT
      };

      // Save to localStorage (same as manual login)
      localStorage.setItem("customerInfo", JSON.stringify(user));

      // Update Redux
      dispatch(loginSuccess(user));

      showNotification({ message: "Google login successful!", color: "green" });
      router.replace("/userInfo");
    } catch (err) {
      console.error(err);
      showNotification({ message: "Invalid token. Please login manually.", color: "red" });
      router.replace("/login");
    }
  }, [router.isReady, router.query, dispatch]);

  return null;
}
