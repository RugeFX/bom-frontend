import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon, MinusCircleIcon, PlusCircleIcon } from "lucide-react";
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
import { BOM } from "@/types/bom";
import useAddBom from "@/hooks/query/bom/useAddBom";
import useUpdateBom from "@/hooks/query/bom/useUpdateBom";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ItemLookup from "./ItemLookup";

type BOMFormProps = { onSuccess: (id: number) => void } & (
  | {
      mode: "update";
      data: BOM;
    }
  | {
      mode: "add";
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function BOMForm(props: BOMFormProps) {
  const { mutateAsync: updateMutate } = useUpdateBom();
  const { mutateAsync: addMutate } = useAddBom();

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === "update"
        ? {
            bom_code: props.data.bom_code,
            items: props.data.material.map((mat) => mat.item_code) ?? [],
          }
        : {
            bom_code: "",
            items: [],
          },
  });
  const { isSubmitting, isDirty } = form.formState;

  const updateHandler = async (payload: FormValues) => {
    if (props.mode !== "update") return;

    const { onSuccess, data } = props;
    const res = await updateMutate({ id: data.id, data: payload });

    toast({
      title: "Successfully updated item",
      description: `BOM with the id "${data.id}" has been updated.`,
      variant: "default",
    });

    console.log(res);

    form.reset({
      bom_code: res.bom_code,
      items: form.getValues("items") ?? [],
    });

    onSuccess(data.id);
  };

  const addHandler = async (payload: FormValues) => {
    if (props.mode !== "add") return;

    const { onSuccess } = props;
    const res = await addMutate({ data: payload });

    toast({
      title: "Successfully added item",
      description: `BOM with the code "${res.bom_code}" has been added.`,
      variant: "default",
    });

    form.reset({
      bom_code: "",
      items: [],
    });

    onSuccess(res.id);
  };

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    console.log(payload);
    try {
      if (props.mode === "update") {
        await updateHandler(payload);
      } else {
        await addHandler(payload);
      }
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
            name="bom_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BOM code</FormLabel>
                <FormControl>
                  <Input placeholder="BOM code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="items"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Items</FormLabel>
                <FormControl>
                  <Dialog>
                    <ItemLookup
                      values={value}
                      onAdd={(code) => onChange([...value, code])}
                      onRemove={(code) => onChange(value.filter((v) => v !== code))}
                    />
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full flex items-center gap-2"
                        {...rest}
                      >
                        <PlusCircleIcon className="w-4 h-4" /> Add item{"(s)"}
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </FormControl>
                <FormMessage />
                {value.length > 0 ? (
                  <ul className="flex flex-col gap-2">
                    {value.map((code) => (
                      <li
                        key={code}
                        className="border border-border flex flex-row sm:flex-row justify-between gap-2 rounded-md"
                      >
                        <span className="block px-5 py-2 truncate">{code}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="rounded-none"
                          onClick={() => onChange(value.filter((v) => v !== code))}
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
        </div>
        <Button disabled={isSubmitting || !isDirty} type="submit">
          {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
