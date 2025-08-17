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

  function recalcBalances(list: Subscribers[]) {
    const total = list.reduce((sum, sub) => sum + Number(sub.paidAmount), 0);
    const perSubscriber = list.length > 0 ? total / list.length : 0;

    return list.map((sub) => ({
      ...sub,
      balance: perSubscriber - Number(sub.paidAmount),
    }));
  }
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
    setSubscribers((prev) =>
      recalcBalances([...prev, { name, paidAmount: amountPaid }])
    );
    setName("");
    setAmountPaid("");
  }

  function deleteSubscriber(index: string) {
    setSubscribers(() => {
      const newList = subscribers.filter(
        (subscriber) => subscriber.name !== index
      );
      return recalcBalances(newList);
    });
  }

  function totalPrices() {
    const totalPrice = subscribers.reduce((pre, sub) => {
      return pre + Number(sub.paidAmount);
    }, 0);
    const perSubscriberPrice =
      totalPrice === 0 ? 0 : Number(totalPrice / subscribers.length).toFixed();

    return {
      totalPrice: totalPrice,
      perSubscriberPrice: perSubscriberPrice,
    };
  }
  const { totalPrice, perSubscriberPrice } = totalPrices();
  return (
    <Box h="100vh">
      <Container>
        <Title mt="xl" ta="start" mb="lg">
          المجموع: {totalPrice}
        </Title>
        {totalPrice > 0 && (
          <>
            <Text size={phone ? "h5" : "h1"} mb="md">
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
      <Flex direction="column" justify="center" align="center" m="xs">
        <Container size="sm" bg="#736c6ce0" bdrs="lg" pr="lg" py="md">
          <Text ta="center" fw="700" style={{ fontSize: "25px" }}>
            موقع خاص بالرحلات والجمعات
          </Text>
          <Text>
            حيث يمكنك تقسيم المبالغ المدفوعة في هذه الرحلة على عدد الاشخاص
            ومراعاة المبالغ المدفوعة من قبل كل شخص وبالتالي يمكنك الحصول على
            المبلغ الواجب دفعه او ارجاعه لكل شخص
          </Text>
          <ul style={{ listStyleType: "disc" }}>
            <li>
              <Text>
                يمكنك اضافة عضو جديد من خلال اختيار اسمه ودخل مبلغ المدفوع
              </Text>
            </li>
            <li>
              <Text>
                في حال المشترك لا يوجد لديه اي مبالغ مدفوعة , فقط اترك حقل
                المبلغ &quot;المدفوع&quot; فارغا
              </Text>
            </li>
            <li>
              <Text> يمكنك حذف عضو من خلال اختيار اسمه وضغط على زر حذف </Text>
            </li>
          </ul>
        </Container>
      </Flex>
    </Box>
  );
}
