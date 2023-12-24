import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
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
import type { Plan } from "@/types/plan";
import useUpdatePlan from "@/hooks/query/plan/useUpdatePlan";
import useAddPlan from "@/hooks/query/plan/useAddPlan";

type FormProps = { onSuccess: (id: number) => void } & (
  | {
      mode: "add";
    }
  | {
      mode: "update";
      data: Plan;
    }
);

type FormValues = z.infer<typeof formSchema>;

export default function PlanForm(props: FormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:
      props.mode === "update"
        ? {
            plan_code: props.data.plan_code,
            name: props.data.name,
            address: props.data.address,
          }
        : {
            plan_code: "",
            name: "",
            address: "",
          },
  });
  const { isSubmitting, isDirty } = form.formState;

  const { mutateAsync: updateMutate } = useUpdatePlan();
  const { mutateAsync: addMutate } = useAddPlan();

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const res =
        props.mode === "update"
          ? await updateMutate({ id: props.data.id, data: payload })
          : await addMutate({ data: payload });

      toast({
        title: "Successfully saved plan",
        description: `Plan with the code "${res.plan_code}" has been saved.`,
        variant: "default",
      });

      form.reset(
        props.mode === "update"
          ? {
              plan_code: res.plan_code,
              name: res.name,
              address: res.address,
            }
          : {
              plan_code: "",
              name: "",
              address: "",
            }
      );
      props.onSuccess(res.id);
    } catch (e) {
      console.error(e);

      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = ["plan_code", "name", "address"];

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
            name="plan_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan code</FormLabel>
                <FormControl>
                  <Input placeholder="Plan code" {...field} />
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
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
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
