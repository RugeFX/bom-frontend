import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Loader2Icon, MinusCircleIcon, PlusCircleIcon, TableIcon } from "lucide-react";
import { isAxiosError } from "axios";
import { z } from "zod";
import { Schema, reservationSchema, returnSchema } from "../data/schema";
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
import { Textarea } from "@/components/ui/textarea";
import useUpdateReservation from "@/hooks/query/reservation/useUpdateReservation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

type FormProps = { data: Schema; onSuccess: (id: number) => void };

type FormValues = z.infer<typeof returnSchema>;

const defaultValues = (data: Schema): FormValues => ({
  reservation_code: data.reservation_code,
  pickupPlan_code: data.pickupPlan_code,
  returnPlan_code: data.returnPlan_code ?? "",
  information: data.information ?? "",
  motor: data.motor_items.map(({ code }) => ({ motor_code: code, status: "Ready For Rent" })),
  fak: data.fak_items.map(({ code }) => ({ fak_code: code, status: "Complete" })),
  hardcase: (data.hardcase_items ?? []).map(({ code }) => ({
    hardcase_code: code,
    status: "Ready For Rent",
  })),
  helmet: data.helmet_items.map(({ code }) => ({ helmet_code: code, status: "Ready For Rent" })),
  status: "Finished Rental",
});

export default function ReturnForm({ data, onSuccess }: FormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: defaultValues(data),
  });

  const { isSubmitting, isDirty } = form.formState;

  const { mutateAsync: updateMutate } = useUpdateReservation();

  const onSubmit: SubmitHandler<FormValues> = async (payload) => {
    try {
      const res = await updateMutate({
        id: data.id,
        data: {
          ...payload,
          information: payload.information || undefined,
        },
      });

      const parsedData = reservationSchema.safeParse(res);

      if (!parsedData.success) {
        toast({
          title: "Edit response parse error!",
          description: parsedData.error.errors.join(","),
          variant: "destructive",
        });
        return;
      }

      form.reset(defaultValues(parsedData.data));
      onSuccess(res.id);
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
          <Tabs defaultValue="return" className="mt-2 w-full">
            <TabsList className="w-full flex">
              <TabsTrigger disabled className="flex-1" value="pickup">
                Pickup
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="return">
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
            name="returnPlan_code"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Return Plan</FormLabel>
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
                statuses={["Ready For Rent", "Out Of Service"] as const}
                values={(field.value ?? []).map(({ motor_code, status }) => ({
                  code: motor_code,
                  status,
                }))}
                onChangeStatus={(code, status) => {
                  const values = field.value;
                  if (!values) return;

                  const foundIndex = values.findIndex((v) => v.motor_code === code);
                  values[foundIndex] = {
                    motor_code: code,
                    status,
                  };
                  field.onChange(values);
                }}
                onSubmitResult={(result) =>
                  field.onChange([...(field.value ?? []), { motor_code: result }])
                }
                onRemoveItem={(code) => {
                  field.onChange((field.value ?? []).filter((item) => item.motor_code !== code));
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
                statuses={["Lost", "Scrab", "Ready For Rent"] as const}
                values={(field.value ?? []).map(({ helmet_code, status }) => ({
                  code: helmet_code,
                  status,
                }))}
                onChangeStatus={(code, status) => {
                  const values = field.value;
                  if (!values) return;

                  const foundIndex = values.findIndex((v) => v.helmet_code === code);
                  values[foundIndex] = {
                    helmet_code: code,
                    status,
                  };
                  field.onChange(values);
                }}
                onSubmitResult={(result) =>
                  field.onChange([...(field.value ?? []), { helmet_code: result }])
                }
                onRemoveItem={(code) => {
                  field.onChange((field.value ?? []).filter((item) => item.helmet_code !== code));
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
                statuses={["Complete", "Incomplete", "Lost"] as const}
                values={(field.value ?? []).map(({ fak_code, status }) => ({
                  code: fak_code,
                  status,
                }))}
                onChangeStatus={(code, status) => {
                  const values = field.value;
                  if (!values) return;

                  const foundIndex = values.findIndex((v) => v.fak_code === code);
                  values[foundIndex] = {
                    fak_code: code,
                    status,
                  };
                  field.onChange(values);
                }}
                onSubmitResult={(result) =>
                  field.onChange([...(field.value ?? []), { fak_code: result }])
                }
                onRemoveItem={(code) => {
                  field.onChange((field.value ?? []).filter((item) => item.fak_code !== code));
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
                statuses={["Ready For Rent", "Scrab", "Lost"] as const}
                values={(field.value ?? []).map(({ hardcase_code, status }) => ({
                  code: hardcase_code,
                  status,
                }))}
                onChangeStatus={(code, status) => {
                  const values = field.value;
                  if (!values) return;

                  const foundIndex = values.findIndex((v) => v.hardcase_code === code);
                  values[foundIndex] = {
                    hardcase_code: code,
                    status,
                  };
                  field.onChange(values);
                }}
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

interface QRFormItemProps<T extends readonly string[]> {
  label: string;
  values: { code: string; status: T[number] }[];
  statuses: T;
  onChangeStatus: (code: string, status: T[number]) => void;
  onSubmitResult: (result: string) => void;
  onRemoveItem: (code: string) => void;
}

function QRFormItem<T extends readonly string[]>({
  label,
  values,
  statuses,
  onChangeStatus,
  onSubmitResult,
  onRemoveItem,
}: QRFormItemProps<T>) {
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
          <ItemScannerNew values={values.map(({ code }) => code)} onSubmit={onSubmitResult} />
        </DrawerContent>
      </Drawer>
      <FormMessage />
      {values.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {values.map(({ code, status }) => (
            <li
              key={code}
              className="border border-border flex flex-row sm:flex-row justify-between gap-2 rounded-md"
            >
              <span className="block px-5 py-2 truncate">{code}</span>
              <div className="flex">
                <Select value={status} onValueChange={(s) => onChangeStatus(code, s)}>
                  <SelectTrigger className="w-[100px] sm:w-[180px] rounded-none border-none bg-secondary transition-colors">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
