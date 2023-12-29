/* eslint-disable @typescript-eslint/no-explicit-any */
import BarChart from "@/pages/dashboard/components/BarChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";

export default function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    async queryFn() {
      const res = await apiClient.get("dashboard");
      return res.data.data;
    },
  });
  return (
    <main className="space-y-4 p-8 pt-6">
      <div className="flex flex-wrap w-full justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      {isLoading ? (
        <>
          <Skeleton className="rounded-md w-full h-14" />
          <div className="grid grid-cols-2 gap-2 animate-pulse">
            <Skeleton className="rounded-md w-full h-24" />
            <Skeleton className="rounded-md w-full h-24" />
            <Skeleton className="rounded-md w-full h-24" />
            <Skeleton className="rounded-md w-full h-24" />
          </div>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              {data.Fak.map((h:any)=>(
                <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fak</CardTitle>
              </CardHeader>
              <CardContent>
                
                <div className="text-2xl font-bold">{h.Total} PCS</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
                </>
              ))}
            </Card>
            <Card>
              {data.AllHardcase.map((h:any)=>(
                <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total {h.name}</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{h.Total} PCS</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
                </>
              ))}
            </Card>
            <Card>
              {data.AllHelmet.map((h:any)=>(
                <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total {h.name}</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{h.Total} PCS</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
                </>
              ))}
            </Card>
            <Card>
              {data.AllMotor.map((h:any)=>(
                <>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total {h.name}</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{h.Total} PCS</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
                </>
              ))}
            </Card>
          </div>
            <div className="flex flex-col xl:flex-row h-max gap-2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>First Aid Kit</CardTitle>
                  <CardDescription>Chart of all FAKs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <PieChart data={data} flag={1} />
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>All Hardcase</CardTitle>
                  <CardDescription>Chart of all Hardcases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <PieChart data={data} flag={3} />
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>All Helmet</CardTitle>
                  <CardDescription>Chart of all Helmets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <PieChart data={data} flag={4} />
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full">
                  <CardHeader>
                    <CardTitle>All Motor</CardTitle>
                    <CardDescription>Chart of all motors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <PieChart data={data} flag={2} />
                    </div>
                  </CardContent>
              </Card>
            </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Motor</CardTitle>
                <CardDescription>Chart of motors and its statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <BarChart data={data.Motor}/>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Hardcase</CardTitle>
                <CardDescription>Chart of hardcases and its statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <LineChart data={data} />
                </div>
              </CardContent>
            </Card>
            {data.Plan.map((p:any)=>(
              <>
              <Card className="">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <CardDescription>Chart of {p.name} and its statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <BarChart data={p.Motor}/>
                  </div>
                </CardContent>
              </Card>
              </>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
