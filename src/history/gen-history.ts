import { HistoryRecord } from "..";

export function addToHistory(names: string[], nameSet: string, additionalInstructions: string) {

  const historyRecord: HistoryRecord = {
    names,
    date: new Date().getTime(),
    nameSet,
    additionalInstructions
  }

  const history = getHistory();
  history.push(historyRecord);
  localStorage.setItem("name-history", JSON.stringify(history));

}


export function getHistory(): HistoryRecord[] {
  const names = localStorage.getItem("name-history");
  if (names) {
    try {
      return JSON.parse(names);
    } catch (e) {
      console.error(e);
      clearHistory();
    }
  }
  return [];
}


export function clearHistory() {
  localStorage.removeItem("name-history");
}
