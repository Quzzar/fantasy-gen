import { atom } from "recoil";

const selectNameSetState = atom({
  key: "select-name-set",
  default: null as string | null,
});

const generatedNamesState = atom({
  key: "generated-names",
  default: [] as string[],
});

export { selectNameSetState, generatedNamesState };