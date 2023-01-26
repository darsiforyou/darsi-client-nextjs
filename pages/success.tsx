import { Box, Center, Title } from "@mantine/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clear_cart } from "../redux/reducers/cartRedux";
export default function Success() {
  const dispatch = useDispatch();

  dispatch(clear_cart());
  return (
    <Box my="xl">
      <Center>
        <Box>
          <Center>
            <Title order={1}>Success</Title>
          </Center>
          <br />
          <Title order={2}>Thank you for your purchase!</Title>
        </Box>
      </Center>
    </Box>
  );
}
