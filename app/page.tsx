"use client";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { SubscribersTable } from "./components/subscribersTable";
import "./globals.css";
import { useMediaQuery } from "@mantine/hooks";

export type Subscribers = {
  name: string;
  paidAmount: string;
  balance?:number
};

export default function Home() {
  const [subscribers, setSubscribers] = useState<Subscribers[]>([]);
  const [name, setName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [generalAmount, setGeneralAmount] = useState("");

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
    } else {
      setSubscribers([...subscribers, { name, paidAmount: amountPaid }]);
    }
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
 function totalForEachOne(){
  const updatedSubscribers = subscribers.map((sub) => {
    const paid = Number(sub.paidAmount);
    const balance = perSubscriberPrice - paid; // موجب = عليه، سالب = له
    return {
      ...sub,
      balance: balance,
    };
  });

  setSubscribers(updatedSubscribers);
 }
  return (
    <Container bg="#594f4f9e" h="100vh" className="content-center">
      <Title ta="start" mb="lg">
        المجموع: {totalPrice}
      </Title>
      {totalPrice > 0 && <Title mb='md'> المبلغ لكل عضو: {perSubscriberPrice}</Title>}
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
      {subscribers.length != 0 && (
        <Box my="xl">
          <SubscribersTable
            deleteSubscriber={deleteSubscriber}
            data={subscribers}
            total={totalForEachOne}
          />
        </Box>
      )}
      <Button fullWidth onClick={totalForEachOne}>
        {" "}
        حساب المبلغ المقرر لكل شخص{" "}
      </Button>
    </Container>
  );
}
