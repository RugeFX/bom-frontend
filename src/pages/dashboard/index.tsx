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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">135</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pickups</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 since last hour</p>
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
                  <BarChart data={data} />
                </div>
              </CardContent>
            </Card>
            <Card>
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
                <CardTitle>
                  <CardHeader>
                    <CardTitle>All Motor</CardTitle>
                    <CardDescription>Chart of all motors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <PieChart data={data} flag={2} />
                    </div>
                  </CardContent>
                </CardTitle>
              </Card>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
