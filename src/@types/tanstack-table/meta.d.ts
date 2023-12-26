import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData> {
    material?: {
      onUpdateClick: (item_code: string) => void;
      onDetailsClick: (item_code: string) => void;
    };
    default?: {
      onUpdateClick: (id: number) => void;
    };
    item?: {
      onUpdateClick: (id: string) => void;
    };
  }
}
