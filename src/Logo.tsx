import { Center, Group, Text, Image } from "@mantine/core";

import logo from "../public/logo.png";

export default function Logo() {

  return (
    <Center p="sm">
      <Group spacing={10}>
        <Image
          src={logo}
          alt={"FantasyGen.dev Logo"}
          width={35}
          radius="xl"
          unselectable="on"
          sx={{
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
        <Text ta="center">
          <Text
            ff={"Titillium Web, sans-serif"}
            fw={500}
            fz={"2.5rem"}
            color="gray.2"
            span
            sx={{
              letterSpacing: "0.03em",
            }}
          >
            FantasyGen
          </Text>
          <Text
            ff={"Titillium Web, sans-serif"}
            fz={"1.2rem"}
            color="gray.3"
            span
          >
            .dev
          </Text>
        </Text>
      </Group>
    </Center>
  );

}
