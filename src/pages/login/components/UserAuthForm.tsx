import { isAxiosError } from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import useLogin from "@/hooks/query/auth/useLogin";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const loginSchema = z.object({
  username: z.string().min(4, { message: "Username length must be longer than 4" }),
  password: z.string().min(5, { message: "Password length must be longer than 5" }),
});

type FormValues = z.infer<typeof loginSchema>;

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: loginMutate } = useLogin();

  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    shouldFocusError: true,
    defaultValues: { username: "", password: "" },
  });
  const {
    formState: { errors, isSubmitting },
    setError,
    handleSubmit,
    control,
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { username, password } = data;

    try {
      await loginMutate({ username, password });
      navigate("/");
    } catch (e) {
      if (isAxiosError<{ message: string; error: { [key: string]: string[] } }>(e)) {
        const errFields = ["username", "password"];

        if (e.response && e.response.status === 400) {
          if (e.response?.data.message.includes("incorrect")) {
            setError("password", { message: "Incorrect username or password" });
          }

          const errors = e.response.data.error ?? {};

          Object.keys(errors).forEach((errKey) => {
            if (errFields.includes(errKey)) {
              const errKeyKnown = errKey as keyof FormValues;
              setError(errKeyKnown, { message: errors[errKeyKnown].join(",") });
            } else {
              setError(`root.custom.${errKey}`, { message: errors[errKey].join(",") });
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
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="**********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {errors.root && errors.root.server.type === "unexpected" && (
            <p className={"text-sm font-medium text-destructive"}>{errors.root.server.message}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </form>
      </Form>
    </div>
  );
}
