import { MouseEventHandler, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import apiClient from "@/api/apiClient";
import { DataTableRowActions } from "./components/DataTableRowActions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { apiAsset, convertToIDR, parseDateStringToLocale } from "@/lib/utils";
import useGetProductDetail from "@/hooks/query/useGetProductDetail";
import { useQuery, type FetchQueryOptions, type QueryClient } from "@tanstack/react-query";
import type { Product } from "@/types/product";
import type { GetAllProductsResponse } from "@/types/response";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useDeleteProduct from "@/hooks/query/useDeleteProduct";
import { useToast } from "@/components/ui/use-toast";
import { DataTableColumnHeader } from "@/components/data-table/DataTableColumnHeader";
import DataTable from "@/components/data-table/DataTable";

export const productsQuery: FetchQueryOptions<Product[]> = {
  queryKey: ["products"],
  queryFn: async () => {
    const res = await apiClient.get<GetAllProductsResponse>("product");
    return res.data.data;
  },
};

export const loader = (queryClient: QueryClient) => async () => {
  return (
    queryClient.getQueryData<Product[]>(productsQuery.queryKey) ??
    (await queryClient.fetchQuery(productsQuery))
  );
};

const productHelper = createColumnHelper<Product>();

export default function ProductPage() {
  const [showProductId, setShownProductId] = useState<string>("");
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const { toast } = useToast();
  // TODO: Change in other routes like below
  const initialData = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: products } = useQuery({ ...productsQuery, initialData });
  const {
    data: productDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    isSuccess: isSuccessDetail,
  } = useGetProductDetail(showProductId, {
    enabled: !!showProductId,
  });
  const { mutateAsync: deleteProductMutate } = useDeleteProduct();

  const onPreviewClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.value;
    setShownProductId(id);
  };

  const onDeleteClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.value;
    setDeleteProductId(id);
  };

  const onSubmitDelete = async () => {
    if (deleteProductId === null) return;

    try {
      await deleteProductMutate({ id: deleteProductId });

      toast({
        title: "Successfully deleted product",
        description: `Product with id: ${deleteProductId} has been deleted.`,
        variant: "default",
      });
    } catch (e) {
      console.error(e);

      toast({
        title: "Failed deleting product",
        description: "An unexpected error has occured.",
        variant: "destructive",
      });
    } finally {
      setDeleteProductId(null);
    }
  };

  const columns: ColumnDef<Product, string>[] = useMemo(
    () => [
      productHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      productHelper.accessor("kodeProduct", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Code" />,
        cell: ({ row }) => (
          <div className="max-w-[80px] truncate">{row.getValue("kodeProduct")}</div>
        ),
      }),
      productHelper.accessor("name", {
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <span className="max-w-[500px] truncate font-medium">{row.getValue("name")}</span>
        ),
      }),
      productHelper.accessor(({ stock }) => `${stock}`, {
        id: "stock",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Stock" />,
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("stock")}</div>,
      }),
      productHelper.accessor(({ netPrice }) => convertToIDR(netPrice), {
        id: "netPrice",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Net Price" />,
        cell: ({ row }) => <div className="w-[120px]">{row.getValue("netPrice")}</div>,
      }),
      productHelper.display({
        id: "actions",
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            onPreviewClick={onPreviewClick}
            onDeleteClick={onDeleteClick}
          />
        ),
      }),
    ],
    []
  );

  return (
    <AlertDialog>
      <DeleteDialogContent onCancel={() => setDeleteProductId(null)} onSubmit={onSubmitDelete} />
      <Sheet>
        <main className="space-y-4 p-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight">Product</h1>
          <SheetContent className="w-5/6 sm:max-w-2xl overflow-y-scroll">
            <SheetHeader>
              <SheetTitle>Product detail</SheetTitle>
              <SheetDescription>See the details of a product.</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {isLoadingDetail ? (
                <Skeleton className="w-full h-[20px] rounded-full" />
              ) : isErrorDetail ? (
                <h2 className="text-center bg-destructive text-destructive-foreground font-semibold animate-pulse p-2 rounded-lg">
                  Error loading details!
                </h2>
              ) : (
                isSuccessDetail && <ProductDetailBody product={productDetail.data} />
              )}
            </div>
          </SheetContent>
          <div className="w-full">
            <DataTable data={products} columns={columns} />
          </div>
        </main>
      </Sheet>
    </AlertDialog>
  );
}

function DeleteDialogContent({
  onCancel,
  onSubmit,
}: {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button variant="destructive" onClick={onSubmit}>
            Delete
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

function ProductDetailBody({ product }: { product: Product }) {
  return (
    <>
      <img
        src={apiAsset(`images/product/${product.image}`)}
        alt={product.name}
        className="object-cover w-full rounded-lg"
      />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Product Code</span>
        <h3 className="font-semibold">{product.kodeProduct}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Name</span>
        <h3 className="font-semibold">{product.name}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Stock</span>
        <h3 className="font-semibold">{product.stock}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Information</span>
        <h3 className="font-semibold">{product.information}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Net Price</span>
        <h3 className="font-semibold">{convertToIDR(product.netPrice)}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Created At</span>
        <h3 className="font-semibold">{parseDateStringToLocale(product.createdAt)}</h3>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="text-muted-foreground text-sm">Updated At</span>
        <h3 className="font-semibold">{parseDateStringToLocale(product.updatedAt)}</h3>
      </div>
      <Separator />
    </>
  );
}
