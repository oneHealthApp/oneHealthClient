import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { TableQueries } from "@/@types/common";
import { dummyTenants } from "@/views/tenants/dummyTenants";

export type Tenant = {
  id: number;
  name: string;
  category: string;
  desc: string;
  attachmentCount: number;
  totalTask: number;
  completedTask: number;
  progression: number;
  dayleft: number;
  status: string;
  member: { name: string; img: string }[];
};

type Tenants = Tenant[];

type GetTenantsResponse = {
  data: Tenants;
  total: number;
};

type FilterQueries = {
  name: string;
  status: string[];
  category: string[];
};

export type TenantListState = {
  loading: boolean;
  deleteConfirmation: boolean;
  selectedTenant: number | null;
  tableData: TableQueries;
  filterData: FilterQueries;
  tenantList: Tenant[];
};

type GetTenantsRequest = TableQueries & { filterData?: FilterQueries };

export const SLICE_NAME = "tenantList";

// API Calls --------------------------------------------------------

// export const getTenants = createAsyncThunk(
//   `${SLICE_NAME}/getTenants`,
//   async (data: GetTenantsRequest) => {
//     const response = await apiGetTenants<GetTenantsResponse, GetTenantsRequest>(
//       data
//     );
//     return response.data;
//   }
// );
export const getTenants = createAsyncThunk(
  `${SLICE_NAME}/getTenants`,
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      data: dummyTenants,
      total: dummyTenants.length,
    };
  }
);

// export const deleteTenant = async (data: { id: number | number[] }) => {
//   const response = await apiDeleteTenants<boolean, { id: number | number[] }>(
//     data
//   );
//   return response.data;
// };

export const deleteTenant = async (data: { id: number | number[] }) => {
  // Simulate deletion success
  return true;
};

// Initial State -----------------------------------------------------

export const initialTableData: TableQueries = {
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  query: "",
  sort: {
    order: "",
    key: "",
  },
};

const initialState: TenantListState = {
  loading: false,
  deleteConfirmation: false,
  selectedTenant: null,
  tenantList: [],
  tableData: initialTableData,
  filterData: {
    name: "",
    status: ["Active", "Inactive"],
    category: ["Tenant", "Clinic"],
  },
};

// Slice -------------------------------------------------------------

const tenantListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    updateTenantList: (state, action) => {
      state.tenantList = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
    toggleDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setSelectedTenant: (state, action) => {
      state.selectedTenant = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTenants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTenants.fulfilled, (state, action) => {
        state.tenantList = action.payload.data;
        state.tableData.total = action.payload.total;
        state.loading = false;
      });
  },
});

export const {
  updateTenantList,
  setTableData,
  setFilterData,
  toggleDeleteConfirmation,
  setSelectedTenant,
} = tenantListSlice.actions;

export default tenantListSlice.reducer;
