import { models } from "./data/data";

export const extractModelFromValue = (model: string) => {
  return models.find((m) => model.split("_")[0] === m.value);
};
