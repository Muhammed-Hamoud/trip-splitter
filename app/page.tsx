"use client";
import React from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { SubscribersTable } from "./components/subscribersTable";
import "./globals.css";
import { useMediaQuery } from "@mantine/hooks";

export type Subscribers = {
  name: string;
  paidAmount: string;
  balance?: number;
};

export default function Page() {
  const [subscribers, setSubscribers] = useState<Subscribers[]>([]);
  const [name, setName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  const phone = useMediaQuery("(max-width: 768px)");

  function addSubscriber() {
    if (!name) return;

    const exists = subscribers.some(
      (subscriber) => subscriber.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      notifications.show({
        color: "red",
        title: "هذا المشترك مسجل بالفعل",
        message: "",
      });
      return;
    }

    setSubscribers((prev) => {
      const newSubscribers = [...prev, { name, paidAmount: amountPaid }];

      const totalPrice = newSubscribers.reduce(
        (pre, sub) => pre + Number(sub.paidAmount),
        0
      );
      const perSubscriberPrice =
        totalPrice === 0 ? 0 : totalPrice / newSubscribers.length;

      return newSubscribers.map((sub) => ({
        ...sub,
        balance: perSubscriberPrice - Number(sub.paidAmount),
      }));
    });

    setName("");
    setAmountPaid("");
  }

  function deleteSubscriber(index: string) {
    setSubscribers(
      subscribers.filter((subscriber) => subscriber.name !== index)
    );
  }

  function totalPrices() {
    const totalPrice = subscribers.reduce((pre, sub) => {
      return pre + Number(sub.paidAmount);
    }, 0);
    const perSubscriberPrice =
      totalPrice === 0 ? 0 : totalPrice / subscribers.length;

    return {
      totalPrice: totalPrice,
      perSubscriberPrice: perSubscriberPrice,
    };
  }
  const { totalPrice, perSubscriberPrice } = totalPrices();
  return (
    <Box h="100vh">
      <Container >
        <Title mt="xl" ta="start" mb="lg">
          المجموع: {totalPrice}
        </Title>
        {totalPrice > 0 && (
          <>
            <Text
              size={phone ? "h5" : "h1"}
              mb="md"
              className={phone ? "text-xs" : "text-xl"}
            >
              {" "}
              المبلغ لكل عضو: {perSubscriberPrice}
            </Text>
          </>
        )}
        <Flex justify="center" align="center">
          <Grid w="100%" align="center" justify="space-evenly">
            <GridCol span={{ base: 12, sm: 4 }} className="text-center">
              <Button fullWidth onClick={addSubscriber}>
                إضافة عضو
              </Button>
            </GridCol>
            <GridCol span={{ base: 12, sm: 8 }}>
              <Group wrap="nowrap" justify="center">
                <input
                  type="text"
                  className={phone ? "h-13" : "h-10"}
                  placeholder="اسم العضو"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className={phone ? "h-13" : "h-10"}
                  type="number"
                  placeholder="المبلغ المدفوع"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </Group>
            </GridCol>
          </Grid>
        </Flex>
      </Container>
      {subscribers.length != 0 && (
        <Box my="xl">
          <SubscribersTable
            deleteSubscriber={deleteSubscriber}
            data={subscribers}
          />
        </Box>
      )}
    </Box>
  );
}
