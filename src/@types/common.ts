import { ReactNode, CSSProperties } from "react";

export interface CommonProps {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}

export type TableQueries = {
  total?: number;
  pageIndex?: number;
  pageSize?: number;
  query?: string;
  sort?: {
    order: "asc" | "desc" | "";
    key: string | number;
  };
};

export interface ApiResponse<T = any, E = any> {
  success: boolean;
  data?: T; // present on success
  error?: E; // present on error
  message: string;
  statusCode?: number; // optional, useful for errors
  timestamp: string;
  method: string;
  path: string;
  requestId: string | null;
  totalPages?: number; // for paginated responses
}

export type BackendMenu = {
  isActive: boolean;
  subMenus: any;
  id: string;
  menuId: string; // Unique ID
  menuName: string;
  path: string;
  childOf?: string | null; // Parent menu ID
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
  };
};

export interface FetchMenusResponse {
  filter(arg0: (m: any) => boolean): BackendMenu[];
  success: boolean;
  data: BackendMenu[];
  message?: string;
  timestamp?: string;
}
