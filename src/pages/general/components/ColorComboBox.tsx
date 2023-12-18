import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Color } from "@/types/color";
import { GetResponse } from "@/types/response";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import type { Noop } from "react-hook-form";

interface ColorComboBoxProps {
  value: string;
  onChange: (id: number) => void;
  onBlur: Noop;
}

export default function ColorComboBox({ value = "", onChange, onBlur }: ColorComboBoxProps) {
  const [open, setOpen] = useState(false);

  const { data: colors } = useQuery({
    queryKey: ["colors"],
    async queryFn() {
      const res = await apiClient.get<GetResponse<Color[]>>("colors");
      return res.data.data;
    },
    initialData: [],
  });
  const filteredColor = colors?.find((color) => +value === color.id);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          aria-expanded={open}
        >
          {value ? filteredColor?.name : "Select a color..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-32 lg:w-64 p-0">
        <Command>
          <CommandGroup>
            {colors?.map((color) => (
              <CommandItem
                key={color.id}
                value={String(color.id)}
                onSelect={(currentValue) => {
                  onChange(+currentValue);
                  setOpen(false);
                }}
                onBlur={onBlur}
              >
                {color.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    +value === color.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
