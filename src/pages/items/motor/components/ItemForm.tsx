import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon, MinusCircleIcon, PlusCircleIcon, TableIcon } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { Schema, formSchema } from "../data/schema";
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
import useUpdateItem from "@/hooks/query/items/useUpdateItem";
import useAddItem from "@/hooks/query/items/useAddItem";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import BOMLookup from "../../components/BOMLookup";
import PlanLookup from "../../components/PlanLookup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statuses } from "../data/data";
import { Textarea } from "@/components/ui/textarea";
import { MotorItem } from "@/types/items";
import GeneralLookup from "./GeneralLookup";
import { useEffect } from "react";
import HardcaseLookup from "./HardcaseLookup";
import { cn } from "@/lib/utils";

type FormProps = { onSuccess: (id: string) => void } & (
  | {
      mode: "add";
    }
  | {
      mode: "update";
      data: MotorItem;
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function ItemForm(props: FormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === "update"
        ? {
            code: props.data.code,
            plan_code: props.data.plan_code,
            bom_code: props.data.bom_code,
            name: props.data.name,
            information: props.data.information,
            status: props.data.status as Schema["status"],
            hardcase_code: props.data.hardcase_code ?? "",
            general: props.data.general?.map((gen) => ({ general_code: gen.code })),
          }
        : {
            code: "",
            plan_code: "",
            bom_code: "",
            name: "",
            information: "",
            hardcase_code: "",
            general: [],
          },
  });
  const { isSubmitting, isDirty, errors } = form.formState;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const { mutateAsync: updateMutate } = useUpdateItem();
  const { mutateAsync: addMutate } = useAddItem();

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const data = { ...payload, hardcase_code: payload.hardcase_code || undefined };

      const res =
        props.mode === "update"
          ? await updateMutate({ code: props.data.code, model: "motor", data })
          : await addMutate({ model: "motor", data });

      toast({
        title: "Successfully saved item",
        description: `Item with the code "${res.code}" has been saved.`,
        variant: "default",
      });

      form.reset(
        props.mode === "update"
          ? {
              code: res.code,
              plan_code: res.plan_code,
              bom_code: res.bom_code,
              name: res.name,
              information: res.information,
              status: res.status as Schema["status"],
              hardcase_code: res.hardcase_code ?? "",
              general: res.general?.map((gen) => ({ general_code: gen.code })),
            }
          : {
              code: "",
              plan_code: "",
              bom_code: "",
              name: "",
              information: "",
              hardcase_code: "",
              general: [],
            }
      );
      props.onSuccess(res.code);
    } catch (e) {
      console.error(e);

      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = [
          "code",
          "plan_code",
          "bom_code",
          "name",
          "information",
          "status",
          "general",
          "hardcase_code",
        ];

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
            title: "Failed saving item",
            description: `An error has occured, ${e.response?.data.message}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed saving item",
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input disabled={props.mode === "update"} placeholder="Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plan_code"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Plan code</FormLabel>
                <Dialog>
                  <PlanLookup
                    value={value}
                    onSelect={(code) => {
                      onChange(code);
                    }}
                  />
                  <FormControl>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-between"
                        {...rest}
                      >
                        {value || "Select a Plan code"}
                        <TableIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DialogTrigger>
                  </FormControl>
                </Dialog>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bom_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BOM code</FormLabel>
                <Dialog>
                  <BOMLookup
                    value={field.value}
                    onSelect={(code) => {
                      field.onChange(code);
                    }}
                  />
                  <FormControl>
                    <DialogTrigger asChild>
                      <Button variant="outline" type="button" className="w-full justify-between">
                        {field.value || "Select a BOM code"}
                        <TableIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DialogTrigger>
                  </FormControl>
                </Dialog>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="general"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Generals</FormLabel>
                <Dialog>
                  <GeneralLookup
                    values={field.value}
                    onAdd={(code) => field.onChange([...field.value, { general_code: code }])}
                    onRemove={(code) =>
                      field.onChange(field.value.filter((v) => v.general_code !== code))
                    }
                  />
                  <FormControl>
                    <DialogTrigger asChild>
                      <Button variant="secondary" type="button" className="w-full justify-between">
                        <PlusCircleIcon className="w-4 h-4" /> Add item{"(s)"}
                        <TableIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DialogTrigger>
                  </FormControl>
                </Dialog>
                <FormMessage />
                {field.value.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {field.value.map(({ general_code }) => (
                      <li
                        key={general_code}
                        className="border border-border flex flex-row sm:flex-row justify-between gap-2 rounded-md"
                      >
                        <span className="block px-5 py-2 truncate">{general_code}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="rounded-none"
                          onClick={() =>
                            field.onChange(
                              field.value.filter((v) => v.general_code !== general_code)
                            )
                          }
                        >
                          <MinusCircleIcon className="w-5 h-5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="block text-muted-foreground text-center w-full">No items</span>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hardcase_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hardcase</FormLabel>
                <Dialog>
                  <HardcaseLookup
                    value={field.value}
                    onSelect={(code) => field.onChange(code)}
                    onUnselect={() => {
                      field.onChange(undefined);
                    }}
                  />
                  <div className={cn("w-full flex flex-col sm:flex-row")}>
                    <FormControl>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          type="button"
                          className="flex-1 justify-between sm:rounded-r-none"
                        >
                          {field.value || "No Hardcase"}
                          <TableIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </DialogTrigger>
                    </FormControl>
                    <Button
                      disabled={!field.value}
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="sm:rounded-l-none"
                    >
                      <MinusCircleIcon className="h-4 w-4" />
                      <span className="sr-only">Remove Hardcase</span>
                    </Button>
                  </div>
                </Dialog>
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
            name="information"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Information</FormLabel>
                <FormControl>
                  <Textarea placeholder="Information" className="resize-y" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
