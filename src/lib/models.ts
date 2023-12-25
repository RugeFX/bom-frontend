import {
  BikeIcon,
  CassetteTapeIcon,
  CrossIcon,
  HardHatIcon,
  PackageIcon,
  type LucideIcon,
} from "lucide-react";

export type ModelValues = "hardcases" | "helmets" | "generals" | "medicines" | "motors";

export const models: { id: string; value: ModelValues; label: string; icon: LucideIcon }[] = [
  {
    id: "MSHRCS",
    value: "hardcases",
    label: "Hardcases",
    icon: CassetteTapeIcon,
  },
  {
    id: "MSHLMT",
    value: "helmets",
    label: "Helmets",
    icon: HardHatIcon,
  },
  {
    id: "MSGNRL",
    value: "generals",
    label: "Generals",
    icon: PackageIcon,
  },
  {
    id: "MSMDCN",
    value: "medicines",
    label: "Medicines",
    icon: CrossIcon,
  },
  {
    id: "MSMTR",
    value: "motors",
    label: "Motors",
    icon: BikeIcon,
  },
] as const;

export const extractModelFromValue = (model: string) => {
  return models.find((m) => model.split("_")[0] === m.value);
};
