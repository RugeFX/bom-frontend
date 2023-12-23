import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { formSchema } from "../data/schema";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialItem } from "@/types/material";
import { extractModelFromValue } from "../utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { models } from "../data/data";
import { cn } from "@/lib/utils";
import useGetSizes from "@/hooks/query/size/useGetSizes";
import { useMemo } from "react";
import useAddMaterial from "@/hooks/query/material/useAddMaterial";
import useUpdateMaterial from "@/hooks/query/material/useUpdateMaterial";

type MaterialFormProps = { onSuccess: (itemCode: string) => void } & (
  | {
      mode: "add";
    }
  | {
      mode: "update";
      data: MaterialItem;
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function MaterialForm(props: MaterialFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === "update"
        ? {
            item_code: props.data.item_code,
            name: props.data.name,
            quantity: props.data.quantity,
            model: extractModelFromValue(props.data.model)?.value,
            attributes: {
              size_id: props.data.attributes.size?.id,
            },
          }
        : {
            item_code: "",
            name: "",
            quantity: 0,
          },
  });
  const { isSubmitting, isDirty } = form.formState;

  const selectedModel = form.watch("model");
  const modelHasSize = ["helmets", "hardcases"].includes(selectedModel);

  const { mutateAsync: updateMutate } = useUpdateMaterial();
  const { mutateAsync: addMutate } = useAddMaterial();
  const { data: sizes } = useGetSizes({ enabled: modelHasSize });

  const filteredSize = useMemo(
    () =>
      sizes?.filter(
        (size) => size.master_code === models.find((model) => model.value === selectedModel)?.id
      ) ?? [],
    [sizes, selectedModel]
  );

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const res =
        props.mode === "update"
          ? await updateMutate({ id: props.data.id, data: payload })
          : await addMutate({ data: payload });

      toast({
        title: "Successfully saved item",
        description: `Item with the code "${res.item_code}" has been saved.`,
        variant: "default",
      });

      form.reset(
        props.mode === "update"
          ? {
              item_code: res.item_code,
              name: res.name,
              quantity: res.quantity,
            }
          : {
              item_code: "",
              name: "",
              quantity: 1,
            }
      );
      props.onSuccess(res.item_code);
    } catch (e) {
      console.error(e);

      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = ["item_code", "name", "quantity", "color_id"];

        if (e.response && e.response.status === 400) {
          const errors = e.response.data.error ?? {};

          Object.keys(errors).forEach((errKey) => {
            if (errFields.includes(errKey)) {
              const errKeyKnown = errKey as keyof FormValues;
              form.setError(errKeyKnown, { message: errors[errKeyKnown].join(",") });
            } else {
              form.setError(`root.custom.${errKey}`, { message: errors[errKey].join(",") });
            }
          });
        } else {
          toast({
            title: "Failed updating item",
            description: `An error has occured, ${e.response?.data.message}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed updating item",
          description: `An error has occured, ${(e as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-stretch gap-4">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="item_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item code</FormLabel>
                <FormControl>
                  <Input placeholder="Item code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Quantity"
                    onChange={(e) => onChange(+e.target.value)}
                    {...rest}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => {
              const selectedModel = models.find((model) => model.value === field.value);
              return (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  {props.mode === "update" ? (
                    <Button disabled variant="outline" className="w-full justify-between">
                      {selectedModel?.label}
                    </Button>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            <div className="flex-1 flex justify-start items-center">
                              {selectedModel !== undefined && (
                                <selectedModel.icon className="mr-2 h-4 w-4 shrink-0" />
                              )}
                              {field.value ? selectedModel?.label : "Select a model..."}
                            </div>
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 lg:w-64 p-0">
                        <Command>
                          <CommandInput placeholder="Search model..." />
                          <CommandGroup>
                            {models.map((model) => (
                              <CommandItem
                                key={model.value}
                                value={model.value}
                                onSelect={() => {
                                  form.setValue("model", model.value);
                                  form.setValue("attributes.size_id", undefined);
                                }}
                              >
                                <model.icon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    model.value === field.value ? "opacity-100" : "opacity-40"
                                  )}
                                />
                                {model.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    model.value === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {modelHasSize && (
            <FormField
              control={form.control}
              name="attributes.size_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {field.value
                            ? filteredSize.find((size) => size.id === field.value)?.name
                            : "Select a model..."}
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 lg:w-64 p-0">
                      <Command>
                        <CommandInput placeholder="Search size..." />
                        <CommandGroup>
                          {filteredSize.map((size) => (
                            <CommandItem
                              key={size.id}
                              value={size.name}
                              onSelect={() => {
                                field.onChange(size.id);
                              }}
                            >
                              {size.name}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  size.id === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <Button disabled={isSubmitting || !isDirty} type="submit">
          {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
