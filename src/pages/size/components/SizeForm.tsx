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
import { Size } from "@/types/size";
import useUpdateSize from "@/hooks/query/size/useUpdateSize";
import useAddSize from "@/hooks/query/size/useAddSize";
import useGetMasters from "@/hooks/query/master/useGetMasters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

type FormProps = { onSuccess: (id: number) => void } & (
  | {
      mode: "add";
    }
  | {
      mode: "update";
      data: Size;
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function SizeForm(props: FormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === "update"
        ? {
            master_code: props.data.master_code,
            name: props.data.name,
          }
        : {
            master_code: "",
            name: "",
          },
  });
  const { isSubmitting, isDirty } = form.formState;

  const { data: masters } = useGetMasters({ initialData: [] });
  const { mutateAsync: updateMutate } = useUpdateSize();
  const { mutateAsync: addMutate } = useAddSize();

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const res =
        props.mode === "update"
          ? await updateMutate({ id: props.data.id, data: payload })
          : await addMutate({ data: payload });

      toast({
        title: "Successfully saved size",
        description: `Size with the id "${res.id}" has been saved.`,
        variant: "default",
      });

      form.reset(
        props.mode === "update"
          ? {
              master_code: res.master_code,
              name: res.name,
            }
          : {
              master_code: "",
              name: "",
            }
      );
      props.onSuccess(res.id);
    } catch (e) {
      console.error(e);

      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = ["master_code", "name"];

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
            title: "Failed saving size",
            description: `An error has occured, ${e.response?.data.message}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed saving size",
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
            name="master_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Master code</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {field.value
                          ? masters?.find((master) => master.master_code === field.value)
                              ?.master_code
                          : "Select a master code..."}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 lg:w-64 p-0">
                    <Command>
                      <CommandInput placeholder="Search masters..." />
                      <CommandGroup>
                        {masters && masters.length ? (
                          masters?.map((master) => (
                            <CommandItem
                              key={master.id}
                              value={master.master_code}
                              onSelect={() => {
                                field.onChange(master.master_code);
                              }}
                            >
                              {master.master_code}
                              <CheckIcon
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  master.master_code === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))
                        ) : (
                          <Loader2Icon className="h-4 w-4 animate-spin" />
                        )}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
        </div>
        <Button disabled={isSubmitting || !isDirty} type="submit">
          {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
