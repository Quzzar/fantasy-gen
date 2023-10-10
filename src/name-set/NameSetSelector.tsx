/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UnstyledButton,
  Checkbox,
  Text,
  SimpleGrid,
  createStyles,
  rem,
  ActionIcon,
  ThemeIcon,
} from "@mantine/core";
import options from "./options";
import { IconDots } from "@tabler/icons-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingState, selectNameSetState } from "../atoms/selectAtoms";
import { valueToColor } from "../gen-utils";

const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
  button: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
    transition: "background-color 150ms ease, border-color 150ms ease",
    border: `${rem(1)} solid ${
      checked
        ? theme.fn.variant({ variant: "outline", color: "indigo" }).border +
          "99"
        : theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[3] + "4F"
    }`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    color: theme.colorScheme === "dark" ? theme.black : theme.white,
    backgroundColor: checked
      ? theme.colors.indigo[1] + "4F"
      : theme.colorScheme === "dark"
      ? theme.colors.dark[8]
      : theme.colors.gray[0] + "4F",
  },

  body: {
    flex: 1,
    marginLeft: theme.spacing.xs,
    marginRight: 0,
  },
}));

interface ImageCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  title: string;
  category: string;
  icon?: React.ReactNode;
  image?: string;
  showOnly?: boolean;
}

export function ImageCheckbox({
  checked,
  defaultChecked,
  onChange,
  showOnly,
  title,
  category,
  icon,
  image,
  className,
  ...others
}: ImageCheckboxProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ImageCheckboxProps>) {

  const [selectNameSet, setSelectNameSet] =
        useRecoilState(selectNameSetState);
  const loading = useRecoilValue(loadingState);

  const { classes, theme, cx } = useStyles({ checked: selectNameSet === title });

  return (
    <UnstyledButton
      {...others}
      onClick={() => {
        if (loading) return;
        if (selectNameSet === title) {
          setSelectNameSet(null);
        } else {
          setSelectNameSet(title);
        }
      }}
      className={cx(classes.button, className)}
      sx={{
        cursor: showOnly ? "default" : "pointer",
      }}
    >
      {/* {image && (
        <Image
          src={image}
          alt={title}
          width={40}
          radius="xl"
          unselectable="on"
          sx={{
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      )} */}
      {icon && (
        <ThemeIcon
          variant="light"
          radius="xl"
          size="lg"
          color={valueToColor(theme, title)}
        >
          {icon}
        </ThemeIcon>
      )}

      <div className={classes.body}>
        <Text c='gray.2' size="xs" sx={{ lineHeight: 1 }} mb={5}>
          {category}
        </Text>
        <Text weight={500} size="lg" sx={{ lineHeight: 1 }}>
          {title}
        </Text>
      </div>

      <Checkbox
        checked={selectNameSet === title}
        onChange={() => {}}
        tabIndex={-1}
        color="indigo"
        mt={5}
        mr={5}
        styles={{ input: { cursor: "pointer", backgroundColor: "transparent", borderColor: "transparent"
       } }}
      />

      <ActionIcon
        variant="transparent"
        size="xs"
        radius="xl"
        color='gray.2'
        sx={{
          position: "absolute",
          top: 0,
          right: 2,
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <IconDots size="0.875rem" />
      </ActionIcon>
    </UnstyledButton>
  );
}

export function ImageCheckboxes() {
  const items = options.sort((a, b) => {
    if (a.category < b.category) {
      return 1;
    } else if (a.category > b.category) {
      return -1;
    } else {
      return a.title.localeCompare(b.title);
    }
  }).map((item) => (
    <ImageCheckbox {...item} key={item.title} />
  ));
  return (
    <SimpleGrid
      cols={3}
      breakpoints={[
        { maxWidth: "md", cols: 2 },
        { maxWidth: "sm", cols: 1 },
      ]}
      spacing={15}
    >
      {items}
    </SimpleGrid>
  );
}
