import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { formSchema } from "../data/schema";
import { General } from "@/types/general";
import { useToast } from "@/components/ui/use-toast";
import useUpdateGeneral from "@/hooks/query/general/useUpdateGeneral";
import useAddGeneral from "@/hooks/query/general/useAddGeneral";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ColorComboBox from "./ColorComboBox";
import { Button } from "@/components/ui/button";

type GeneralFormProps = { onSuccess: (id: number) => void } & (
  | {
      mode: "update";
      data: General;
    }
  | {
      mode: "add";
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function GeneralForm(props: GeneralFormProps) {
  const { mutateAsync: updateMutate } = useUpdateGeneral();
  const { mutateAsync: addMutate } = useAddGeneral();

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === "update"
        ? {
            item_code: props.data.item_code,
            name: props.data.name,
            quantity: props.data.quantity,
            color_id: props.data.color_id,
          }
        : {
            item_code: "",
            name: "",
            quantity: 1,
            color_id: 1,
          },
  });
  const { isSubmitting, isDirty } = form.formState;

  const updateHandler = async (payload: FormValues) => {
    if (props.mode !== "update") return;

    const { onSuccess, data } = props;
    const res = await updateMutate({ id: data.id, data: payload });

    toast({
      title: "Successfully updated item",
      description: `Item with the id "${data.id}" has been updated.`,
      variant: "default",
    });

    form.reset({
      item_code: res.item_code,
      name: res.name,
      quantity: res.quantity,
      color_id: res.color_id,
    });

    onSuccess(data.id);
  };

  const addHandler = async (payload: FormValues) => {
    if (props.mode !== "add") return;

    const { onSuccess } = props;
    const res = await addMutate({ data: payload });

    toast({
      title: "Successfully added item",
      description: `Item with the code "${res.item_code}" has been added.`,
      variant: "default",
    });

    form.reset({
      item_code: "",
      name: "",
      quantity: 1,
      color_id: 1,
    });

    onSuccess(res.id);
  };

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
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
            name="color_id"
            render={({ field: { value, onChange, onBlur } }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <ColorComboBox value={String(value)} onChange={onChange} onBlur={onBlur} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isSubmitting || !isDirty} type="submit">
          {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </Form>
  );
}
