import { MantineTheme, MantineColor } from "@mantine/core";
import { Name, NameSet } from ".";
import { AI_FUNCTION_URL } from "./data";


export async function getAICompletion(content: string, model = "gpt-4") {
  const res = await fetch(AI_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: content,
      model: model,
    }),
  });
  return res.ok
    ? await res.text()
    : "Too many requests, please try again later.";
}

export async function generateNames(nameSet: NameSet, amount: number, extra?: string) {

  const prompt = `
    Please generate ${amount} fantasy name for something like D&D or MTG. It should be a first name and title. Please make the first name bold in markdown.

    ${nameSet.instructions}

    ${extra || ""}

    ### Examples:
    ${nameSet.data.join("\n")}
  `;

  const result = await getAICompletion(prompt);

  const names = result
    .split("\n")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  return names;
}


export async function generateEtymology(name: Name) {
  const prompt = `
    What is the potential etymology of the following name?
    ${name.base}

    These are made up fantasy names, there's no need to mention that it's not very common. Only say what you can about the possible etymology. Don't mention the author, it's not relevant in this context. Please format your response in markdown.
  `;

  return (await getAICompletion(prompt)).trim();
}


export async function generateBackstory(name: Name, nameSet: NameSet) {

  const category =
    nameSet.category === "Ancestry"
      ? `Their fantasy race is ${nameSet.title.toLowerCase()}.`
      : `They're apart of the ${nameSet.title.toLowerCase()} category.`;

  const prompt = `
    Please create backstory for the following fantasy individual:

    ${name.prefix} ${name.base} ${name.suffix}

    They are an individual in a fantasy world. ${category}
    Respond with the following sections formatted in markdown:
    ### Hometown
    ### Family, friends, and pets
    ### Personality
    ### Origin Story
    ### Interesting Fun Fact
  `;

  return (await getAICompletion(prompt, 'gpt-3.5-turbo')).trim();

}


export async function getIcon(content: string) {
  const res = await fetch(
    `https://api.dicebear.com/7.x/shapes/svg?seed=${content}`
  );
  return res.ok ? await res.text() : "";
}


/**
 * Returns a fitting color for a given value.
 * @param theme
 * @param value
 * @returns - color name in mantine theme colors
 */
const PRESET_COLOR_MAPS: Record<string, MantineColor> = {
  benevolent: "green",
  dark_lord: 'red',
  wizard: 'blue',
  catfolk: "orange",
  azarketi: 'cyan',
  elf: "green",
  leshy: "green",
}
export function valueToColor(theme: MantineTheme, value: string): MantineColor {
  if (!value) {
    return "gray";
  }
  value = value.toLowerCase().trim().replace(/ /g, "_");

  if (PRESET_COLOR_MAPS[value]) {
    return PRESET_COLOR_MAPS[value];
  }

  // Get a 'random' mantine color name
  let i = 0;
  const index = hashString(value, Object.keys(theme.colors).length);
  for (const color in theme.colors) {
    if (i === index) {
      const colorName = color satisfies MantineColor;
      if (colorName === "dark" || colorName === "gray") {
        return "indigo";
      } else {
        return colorName;
      }
    }
    i++;
  }

  return "gray";
}


/**
 * Given a string, returns a number between 0 and range that is consistent for the same string.
 * @param str
 * @param range
 * @returns - Consistent number between 0 and range
 */
export function hashString(str: string, range: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % range;
  }
  return hash;
}


/**
 * Converts a date to a local time string in the format MMM D, h:mm a
 * @param date 
 * @returns - Date in the format MMM D, h:mm a
 */
export function convertDateToLocalTime(date: Date) {
  if(date.getTime() === 0) { return "Unknown Time"; }
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
}
