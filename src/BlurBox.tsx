import { Box } from "@mantine/core";

export default function BlurBox(props: { children: React.ReactNode }) {
  return (
    <Box
      p={"sm"}
      sx={(theme) => ({
        // border: `1px solid ${
        //   theme.colorScheme === "dark"
        //     ? theme.colors.dark[5]
        //     : theme.colors.gray[2]
        // }`,
        borderRadius: theme.radius.md,
        backdropFilter: "blur(6px)",
        // Add alpha channel to hex color (browser support: https://caniuse.com/css-rrggbbaa)
        backgroundColor:
          (theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0]) + "50",
      })}
    >
      {props.children}
    </Box>
  );
}
