/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Box,
  Button,
  Center,
  Text,
  Modal,
  ScrollArea,
  Stack,
  Textarea,
  useMantineTheme,
  Divider,
  Loader,
  ActionIcon,
  Tooltip,
  List,
  Avatar,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDisclosure, useElementSize } from "@mantine/hooks";
import { ImageCheckboxes } from "./name-set/NameSetSelector";
import { useRecoilState, useRecoilValue } from "recoil";
import { generatedNamesState, selectNameSetState } from "./atoms/selectAtoms";
import options from "./name-set/options";
import BlurBox from "./BlurBox";
import Logo from "./Logo";
import {
  convertDateToLocalTime,
  generateBackstory,
  generateEtymology,
  generateNames,
  getIcon,
} from "./gen-utils";
import NameDisplay from "./name-set/NameDisplay";
import Markdown from "react-markdown";
import { Name } from ".";
import { addToHistory, getHistory } from "./history/gen-history";
import { IconHistory } from "@tabler/icons-react";

const GEN_AMT = 10;

export default function MainPage() {
  const { ref, width } = useElementSize();
  const theme = useMantineTheme();

  const selectedNameSet = useRecoilValue(selectNameSetState);
  const nameSet = options.find((option) => option.title === selectedNameSet);

  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const [generatedNames, setGeneratedNames] =
    useRecoilState(generatedNamesState);

  const [loading, setLoading] = useState(false);
  const [genListOpened, { open: openGenList, close: closeGenList }] =
    useDisclosure(false);
  const [genHistoryOpened, { open: openHistoryList, close: closeHistoryList }] =
    useDisclosure(false);

  const [activeName, setActiveName] = useState<Name | null>(null);
  const [etymologyOpened, { open: openEtymology, close: closeEtymology }] =
    useDisclosure(false);
  const [etymology, setEtymology] = useState<string | null>(null);
  const [detailsOpened, { open: openDetails, close: closeDetails }] =
    useDisclosure(false);
  const [imgSvg, setImgSvg] = useState("");

  const [backstoryOpened, { open: openBackstory, close: closeBackstory }] =
    useDisclosure(false);
  const [backstory, setBackstory] = useState<string | null>(null);

  // Generate etymology
  useEffect(() => {
    if (!activeName) return;
    if (etymology === "") return;
    if (!etymologyOpened) return;
    setEtymology("");
    generateEtymology(activeName).then((etymology) => {
      setEtymology(etymology);
    });
  }, [activeName]);

  // Generate backstory
  useEffect(() => {
    if (!activeName) return;
    if (backstory === "") return;
    if (!backstoryOpened) return;

    const nameSet = options.find(
      (option) =>
        option.title ===
        getHistory().find((record) =>
          record.names.find((name) => name.includes(activeName?.base ?? ""))
        )?.nameSet
    );
    if (!nameSet) return;
    setBackstory("");
    console.log(nameSet);

    generateBackstory(activeName, nameSet).then((backstory) => {
      setBackstory(backstory);
    });
  }, [activeName]);

  // Fetch icon
  useEffect(() => {
    if (!activeName) return;
    if (!detailsOpened) return;
    setImgSvg("");

    getIcon(activeName.base).then((svg) => {
      setImgSvg(svg);
    });
  }, [activeName]);

  return (
    <>
      <Box
        sx={{
          position: "absolute",
          left: `calc(50% - ${width / 2}px)`,
          top: "0%",
        }}
      >
        <Logo />
        <Stack
          spacing={"sm"}
          sx={{
            position: "relative",
          }}
          ref={ref}
        >
          {getHistory().length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 5,
                right: -30,
              }}
            >
              <Tooltip label="History" withArrow>
                <ActionIcon
                  radius="xl"
                  variant="transparent"
                  size="sm"
                  color="gray.2"
                  onClick={openHistoryList}
                >
                  <IconHistory size="1.6rem" stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            </Box>
          )}
          <BlurBox>
            <ScrollArea h={260}>
              <ImageCheckboxes />
            </ScrollArea>
          </BlurBox>
          <BlurBox>
            <Textarea
              placeholder="Additional Instructions"
              variant="unstyled"
              styles={(theme) => ({
                input: {
                  padding: "0px!important",
                  "::placeholder": {
                    color: theme.colors.gray[3],
                    fontStyle: "italic",
                  },
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[9]
                      : theme.colors.gray[0],
                },
              })}
              value={additionalInstructions}
              onChange={(event) =>
                setAdditionalInstructions(event.currentTarget.value)
              }
            />
          </BlurBox>
          <Center mt="md">
            <Button
              variant="gradient"
              gradient={{ from: "#649ad6", to: "#ffa29a", deg: 190 }}
              size="lg"
              radius="md"
              loading={loading}
              onClick={async () => {
                if (!nameSet) return;
                setLoading(true);

                const names = await generateNames(
                  nameSet,
                  GEN_AMT,
                  additionalInstructions
                );
                setGeneratedNames(names);
                addToHistory(names, nameSet.title, additionalInstructions);

                setTimeout(() => {
                  openGenList();
                  setLoading(false);
                }, 1);
              }}
            >
              Generate Names
            </Button>
          </Center>
        </Stack>
      </Box>
      <Modal
        opened={genListOpened}
        onClose={closeGenList}
        closeOnClickOutside={false}
        title={<Text fz="1.5rem">Generated Names</Text>}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.05,
          blur: 3,
        }}
        styles={{
          header: {
            paddingBottom: "2px!important",
          },
          body: {
            minHeight: 300,
            maxHeight: 500,
          },
        }}
      >
        {nameSet && (
          <Text fw={400} fz="sm" c="dimmed">
            Here are {GEN_AMT} randomly generated {nameSet.title.toLowerCase()}{" "}
            names.
          </Text>
        )}
        <Divider my={10} />
        {[...generatedNames].sort().map((rawName, index) => (
          <NameDisplay
            key={index}
            rawName={rawName}
            onClickDetails={(name) => {
              setActiveName(name);
              openDetails();
            }}
            onClickEtymology={(name) => {
              setActiveName(name);
              openEtymology();
            }}
            onClickBackstory={(name) => {
              setActiveName(name);
              openBackstory();
            }}
          />
        ))}
      </Modal>
      <Modal
        opened={genHistoryOpened}
        onClose={closeHistoryList}
        closeOnClickOutside={false}
        title={<Text fz="1.5rem">Generation History</Text>}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.05,
          blur: 3,
        }}
        styles={{
          header: {
            paddingBottom: "2px!important",
          },
          body: {
            minHeight: 300,
            maxHeight: 500,
          },
        }}
      >
        {getHistory()
          .reverse()
          .map((record, index) => (
            <Box key={index}>
              <Divider />
              <Stack spacing={5} my={10}>
                <Text>
                  <Text fz="xs" span>
                    {convertDateToLocalTime(new Date(record.date))}
                  </Text>{" "}
                  —{" "}
                  <Text fw="500" span>
                    {record.nameSet}
                  </Text>
                </Text>
                {record.additionalInstructions && (
                  <Text fs="italic" c="dimmed" fz="xs">
                    {record.additionalInstructions}
                  </Text>
                )}
                <Box>
                  {record.names.sort().map((rawName, index) => (
                    <NameDisplay
                      key={index}
                      rawName={rawName}
                      onClickDetails={(name) => {
                        setActiveName(name);
                        openDetails();
                      }}
                      onClickEtymology={(name) => {
                        setActiveName(name);
                        openEtymology();
                      }}
                      onClickBackstory={(name) => {
                        setActiveName(name);
                        openBackstory();
                      }}
                    />
                  ))}
                </Box>
              </Stack>
            </Box>
          ))}
      </Modal>
      <Modal
        opened={etymologyOpened}
        onClose={closeEtymology}
        closeOnClickOutside={false}
        title={<Text fz="1.5rem">Etymology of {activeName?.base}</Text>}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.05,
          blur: 3,
        }}
        styles={{
          header: {
            paddingBottom: "2px!important",
          },
          body: {
            minHeight: 300,
            maxHeight: 500,
          },
        }}
      >
        <Divider />
        {etymology ? (
          <Markdown>{etymology}</Markdown>
        ) : (
          <Center h={200}>
            <Loader color="indigo" variant="dots" size="xl" />
          </Center>
        )}
      </Modal>
      <Modal
        opened={backstoryOpened}
        onClose={closeBackstory}
        closeOnClickOutside={false}
        title={<Text fz="1.5rem">{activeName?.base}'s Backstory</Text>}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.05,
          blur: 3,
        }}
        styles={{
          header: {
            paddingBottom: "2px!important",
          },
          body: {
            minHeight: 300,
            maxHeight: 500,
          },
        }}
      >
        <Divider />
        {backstory ? (
          <Markdown>{backstory}</Markdown>
        ) : (
          <Center h={200}>
            <Loader color="indigo" variant="dots" size="xl" />
          </Center>
        )}
      </Modal>
      <Modal
        opened={detailsOpened}
        onClose={closeDetails}
        closeOnClickOutside={false}
        title={<Text fz="1.5rem">Generation Details</Text>}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.05,
          blur: 3,
        }}
        styles={{
          header: {
            paddingBottom: "2px!important",
          },
          body: {
            minHeight: 300,
            maxHeight: 500,
          },
        }}
      >
        <Divider />
        <Text ta="center" py="sm">
          <Text fz="sm" fs="italic" span>
            {activeName?.prefix}
          </Text>
          <Text fz="xl" span>
            {activeName?.base}
          </Text>
          <Text fz="sm" fs="italic" span>
            {activeName?.suffix}
          </Text>
        </Text>
        <Center>
          <Avatar
            radius={100}
            size={100}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(imgSvg)}`}
            alt={activeName?.base}
          />
        </Center>
        <List pt={20} pl={"25%"}>
          <List.Item fz="sm">
            From{" "}
            <Text fw={600} span>
              {
                getHistory().find((record) =>
                  record.names.find((name) =>
                    name.includes(activeName?.base ?? "")
                  )
                )?.nameSet
              }
            </Text>{" "}
            name set
          </List.Item>
          {getHistory().find((record) =>
            record.names.find((name) => name.includes(activeName?.base ?? ""))
          )?.additionalInstructions && (
            <List.Item fz="sm">Added Instructions:</List.Item>
          )}
        </List>
        {getHistory().find((record) =>
          record.names.find((name) => name.includes(activeName?.base ?? ""))
        )?.additionalInstructions && (
          <Text ta="center" fz="xs" fs="italic" px={40}>
            {
              getHistory().find((record) =>
                record.names.find((name) =>
                  name.includes(activeName?.base ?? "")
                )
              )?.additionalInstructions
            }
          </Text>
        )}
      </Modal>
    </>
  );
}
