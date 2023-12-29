import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon, MinusCircleIcon, PlusCircleIcon, TableIcon } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { pickupSchema } from "../data/schema";
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PlanLookup from "./PlanLookup";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ItemScannerNew } from "./ItemScannerNew";
import useAddReservation from "@/hooks/query/reservation/useAddReservation";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type FormProps = { onSuccess: (id: number) => void };

type FormValues = z.infer<typeof pickupSchema>;

/*
  Field Values for dev:

  motor: [{ motor_code: "MOTR1" }],
  fak: [{ fak_code: "FAK1" }],
  helmet: [{ helmet_code: "HELM1" }],
*/

const defaultValues: FormValues = {
  reservation_code: "",
  pickupPlan_code: "",
  information: "",
  motor: [],
  fak: [],
  helmet: [],
  hardcase: [],
  status: "In Rental",
};

export default function PickupForm(props: FormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(pickupSchema),
    defaultValues,
  });

  const { isSubmitting, isDirty } = form.formState;

  const { mutateAsync: addMutate } = useAddReservation();

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const res = await addMutate({
        data: {
          ...payload,
          information: payload.information || undefined,
        },
      });

      form.reset(defaultValues);
      props.onSuccess(res.id);
    } catch (e) {
      console.error(e);

      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = [
          "reservation_code",
          "pickupPlan_code",
          "returnPlan_code",
          "information",
          "motor",
          "helmet",
          "fak",
          "hardcase",
          "status",
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
            title: "Failed saving reservation",
            description: `An error has occured, ${e.response?.data.message}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Failed saving reservation",
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
          <Label>Type</Label>
          <Tabs defaultValue="pickup" className="mt-2 w-full">
            <TabsList className="w-full flex">
              <TabsTrigger className="flex-1" value="pickup">
                Pickup
              </TabsTrigger>
              <TabsTrigger className="flex-1" disabled value="return">
                Return
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <FormField
            control={form.control}
            name="reservation_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Reservation code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pickupPlan_code"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Pickup Plan</FormLabel>
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
            name="motor"
            render={({ field }) => (
              <QRFormItem
                label="Motor"
                values={field.value.map((item) => item.motor_code)}
                onSubmitResult={(result) =>
                  field.onChange([...field.value, { motor_code: result }])
                }
                onRemoveItem={(code) => {
                  field.onChange(field.value.filter((item) => item.motor_code !== code));
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="helmet"
            render={({ field }) => (
              <QRFormItem
                label="Helmet"
                values={field.value.map((item) => item.helmet_code)}
                onSubmitResult={(result) =>
                  field.onChange([...field.value, { helmet_code: result }])
                }
                onRemoveItem={(code) => {
                  field.onChange(field.value.filter((item) => item.helmet_code !== code));
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="fak"
            render={({ field }) => (
              <QRFormItem
                label="FAK"
                values={field.value.map((item) => item.fak_code)}
                onSubmitResult={(result) => field.onChange([...field.value, { fak_code: result }])}
                onRemoveItem={(code) => {
                  field.onChange(field.value.filter((item) => item.fak_code !== code));
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="hardcase"
            render={({ field }) => (
              <QRFormItem
                label="Hardcase"
                values={(field.value ?? []).map((item) => item.hardcase_code)}
                onSubmitResult={(result) =>
                  field.onChange([...(field.value ?? []), { hardcase_code: result }])
                }
                onRemoveItem={(code) => {
                  field.onChange((field.value ?? []).filter((item) => item.hardcase_code !== code));
                }}
              />
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

interface QRFormItemProps {
  label: string;
  values: string[];
  onSubmitResult: (result: string) => void;
  onRemoveItem: (code: string) => void;
}

function QRFormItem({ label, values, onSubmitResult, onRemoveItem }: QRFormItemProps) {
  return (
    <FormItem>
      <FormLabel>{label}s</FormLabel>
      <Drawer>
        <FormControl>
          <DrawerTrigger asChild>
            <Button variant="secondary" type="button" className="w-full justify-between">
              <PlusCircleIcon className="w-4 h-4" /> Add {label}
              {"(s)"} via QR
              <TableIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DrawerTrigger>
        </FormControl>
        <DrawerContent>
          <ItemScannerNew values={values} onSubmit={onSubmitResult} />
        </DrawerContent>
      </Drawer>
      <FormMessage />
      {values.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {values.map((code) => (
            <li
              key={code}
              className="border border-border flex flex-row sm:flex-row justify-between gap-2 rounded-md"
            >
              <span className="block px-5 py-2 truncate">{code}</span>
              <div className="flex">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="rounded-none"
                  onClick={() => onRemoveItem(code)}
                >
                  <MinusCircleIcon className="w-5 h-5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <span className="block text-muted-foreground text-center w-full">No items</span>
      )}
    </FormItem>
  );
}
