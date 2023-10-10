import {
  useMantineTheme,
  Group,
  Menu,
  ActionIcon,
  Text,
  Avatar,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconDots, IconInfoCircle, IconLanguage, IconUserScan } from "@tabler/icons-react";
import { getIcon } from "../gen-utils";
import { Name } from "..";
import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";

export default function NameDisplay(props: {
  rawName: string;
  onClickDetails: (name: Name) => void;
  onClickEtymology: (name: Name) => void;
  onClickBackstory: (name: Name) => void;
}) {
  const theme = useMantineTheme();

  const match = props.rawName.match(/\*\*.+?\*\*/);
  let baseName = match ? match[0] : "";

  const parts = props.rawName.split(baseName);
  let prefix = parts[0].trim();
  let suffix = parts[1].trim();

  if (prefix.length <= 4) {
    prefix = "";
  }
  if (!prefix) {
    suffix = ", " + suffix;
  } else {
    prefix = prefix + " ";
    suffix = " " + suffix;
  }
  baseName = baseName.replace(/\*/g, "").trim();

  const [debouncedBaseName] = useDebouncedValue(baseName, 200);
  const [imgSvg, setImgSvg] = useState("");
  useEffect(() => {
    getIcon(debouncedBaseName).then((svg) => {
      setImgSvg(svg);
    });
  }, [debouncedBaseName]);

  return (
    <Group
      noWrap
      w="100%"
      px={8}
      py={6}
      sx={{
        ":hover": {
          cursor: "pointer",
          backgroundColor: theme.colors.indigo[0],
          borderRadius: theme.radius.sm,
        },
        position: "relative",
      }}
      onClick={() => {
        notifications.clean();
        notifications.show({
          id: "copied-name",
          title: (
            <Group spacing={10}>
              <Text fz="1.1rem">Copied to Clipboard</Text>
            </Group>
          ),
          message: (
            <Text>
              Copied <strong>{baseName}</strong> to clipboard
            </Text>
          ),
          color: "indigo",
        });
        navigator.clipboard.writeText(`${prefix}${baseName}${suffix}`);
      }}
    >
      {/* <ThemeIcon
        variant="light"
        size="xs"
        radius="xl"
        color={valueToColor(theme, baseName)}
      >
        <IconUserCircle size="1.1rem" />
      </ThemeIcon> */}
      <Avatar
        radius={15}
        size={15}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(imgSvg)}`}
        alt={baseName}
      />
      <Text>
        {prefix && (
          <Text fz="xs" fs="italic" pr={3} span>
            {prefix}
          </Text>
        )}
        <Text fz="lg" span>
          {baseName}
        </Text>
        <Text fz="xs" fs="italic" span>
          {suffix}
        </Text>
      </Text>
      <Menu shadow="md" width={150} withArrow withinPortal>
        <Menu.Target>
          <ActionIcon
            radius="xl"
            size="lg"
            sx={{
              position: "absolute",
              top: 3,
              right: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <IconDots size="1.0rem" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            icon={<IconInfoCircle size={18} />}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onClickDetails({ base: baseName, prefix, suffix });
            }}
          >
            Gen Details
          </Menu.Item>
          <Menu.Item
            icon={<IconLanguage size={18} />}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onClickEtymology({ base: baseName, prefix, suffix });
            }}
          >
            Etymology
          </Menu.Item>
          <Menu.Item
            icon={<IconUserScan size={18} />}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              props.onClickBackstory({ base: baseName, prefix, suffix });
            }}
          >
            Backstory
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
