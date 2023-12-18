import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./routes";
import { useTheme } from "./store";
import { useEffect } from "react";
import { changeRootTheme } from "./lib/utils";

const queryClient = new QueryClient();

function App() {
  const theme = useTheme();

  useEffect(() => {
    changeRootTheme(theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router(queryClient)} />
    </QueryClientProvider>
  );
}

export default App;
