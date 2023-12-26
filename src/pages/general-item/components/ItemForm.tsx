import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon, TableIcon } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { type Schema, formSchema } from "../data/schema";
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
import BOMLookup from "./BOMLookup";
import PlanLookup from "./PlanLookup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statuses } from "../data/data";
import { Textarea } from "@/components/ui/textarea";

type FormProps = { onSuccess: (id: string) => void } & (
  | {
      mode: "add";
    }
  | {
      mode: "update";
      data: Schema;
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
            status: props.data.status,
          }
        : {
            code: "",
            plan_code: "",
            bom_code: "",
            name: "",
            information: "",
          },
  });
  const { isSubmitting, isDirty } = form.formState;

  const { mutateAsync: updateMutate } = useUpdateItem();
  const { mutateAsync: addMutate } = useAddItem();

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const res =
        props.mode === "update"
          ? await updateMutate({ code: props.data.code, model: "general", data: payload })
          : await addMutate({ model: "general", data: payload });

      toast({
        title: "Successfully saved plan",
        description: `Plan with the code "${res.plan_code}" has been saved.`,
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
            }
          : {
              code: "",
              plan_code: "",
              bom_code: "",
              name: "",
              information: "",
            }
      );
      props.onSuccess(res.code);
    } catch (e) {
      console.error(e);

      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = ["code", "plan_code", "bom_code", "name", "information", "status"];

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
            title: "Failed saving plan",
            description: `An error has occured, ${e.response?.data.message}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed saving plan",
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
                  <Input placeholder="Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plan_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan code</FormLabel>
                <Dialog>
                  <PlanLookup
                    value={field.value}
                    onSelect={(code) => {
                      field.onChange(code);
                    }}
                  />
                  <FormControl>
                    <DialogTrigger asChild>
                      <Button variant="outline" type="button" className="w-full justify-between">
                        {field.value || "Select a Plan code"}
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
