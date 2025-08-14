import { ActionIcon,Group, Table, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import "../globals.css";
import { Subscribers } from "../page";


type Subscriber = {
  data: Subscribers[];
  deleteSubscriber: (index: string)=> void;
};

export function SubscribersTable({ data,deleteSubscriber }: Subscriber) {
  console.log(data.map((s=>s.balance)))
  const rows = data.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {item.name}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {!item.paidAmount ? "--" : item.paidAmount}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.balance !== undefined && item.balance > 0 && item.balance}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text fz="sm" fw={500}>
          {item.balance !== undefined && item.balance < 0 && Math.abs(item.balance)}
        </Text>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          onClick={() => deleteSubscriber(item.name)}
          variant="subtle"
          color="red"
        >
          <IconTrash size={25} stroke={1.5} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table verticalSpacing="sm" withColumnBorders>
      <Table.Thead className="bg-[#916666] text-[#5d1c1c]">
        <Table.Tr>
          <Table.Th ta="right"> المشترك </Table.Th>
          <Table.Th ta="right"> المدفوع </Table.Th>
          <Table.Th ta="right"> له </Table.Th>
          <Table.Th ta="right"> عليه </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
