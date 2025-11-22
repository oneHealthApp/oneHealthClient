import { useMemo, useRef } from "react";
import DataTable from "@/components/shared/DataTable";
import Badge from "@/components/ui/Badge";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import { setTableData, setSelectedTenant, toggleDeleteConfirmation, useAppDispatch, useAppSelector } from "@/store";

import type { ColumnDef, DataTableResetHandle, OnSortParam } from "@/components/shared/DataTable";

import { format } from "date-fns";
import { Tenant } from "@/@types/tenant";
import { dummyTenants } from "../../dummyTenants";


// STATUS COLORS
const tenantStatusColors = {
  true: { label: "Active", dotClass: "bg-emerald-500", textClass: "text-emerald-500" },
  false: { label: "Inactive", dotClass: "bg-red-500", textClass: "text-red-500" },
};

const ActionColumn = ({ row }: { row: Tenant }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex justify-end text-lg">
      <span
        className="cursor-pointer p-2 hover:text-blue-500"
        onClick={() => navigate(`/superadmin/tenant/${row.id}`)}
      >
        <HiOutlinePencil />
      </span>
      <span
        className="cursor-pointer p-2 hover:text-red-500"
        onClick={() => {
          dispatch(toggleDeleteConfirmation(true));
          dispatch(setSelectedTenant(row.id));
        }}
      >
        <HiOutlineTrash />
      </span>
    </div>
  );
};

const TenantTable = () => {
  const tableRef = useRef<DataTableResetHandle>(null);
  const dispatch = useAppDispatch();

  // Only table pagination metadata comes from redux
  const { pageIndex, pageSize, sort, query, total } = useAppSelector(
    (state) => state.tenantList.tableData
  );

  const tableData = useMemo(
    () => ({ pageIndex, pageSize, sort, query, total }),
    [pageIndex, pageSize, sort, query, total]
  );

  // STATIC DATA — FIXED, NO FETCH
  const tenantList: Tenant[] = dummyTenants;

  const columns: ColumnDef<Tenant>[] = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      {
        header: "Slug",
        accessorKey: "slug",
        cell: (props) => <span className="text-gray-600">{props.row.original.slug}</span>,
      },
      {
        header: "Address",
        accessorKey: "address",
        cell: (props) => {
          const addr = props.row.original.address;
          return addr ? (
            <span>{addr.address}, {addr.town}</span>
          ) : (
            <span className="text-gray-400">No Address</span>
          );
        },
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (props) => {
          const dt = props.row.original.createdAt;
          return dt ? <span>{format(new Date(dt), "dd MMM yyyy")}</span> : "N/A";
        },
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (props) => {
          const active = props.row.original.isActive;
          return (
            <div className="flex items-center gap-2">
              <Badge className={tenantStatusColors[active].dotClass} />
              <span className={`font-semibold ${tenantStatusColors[active].textClass}`}>
                {tenantStatusColors[active].label}
              </span>
            </div>
          );
        },
      },
      {
        header: "",
        id: "action",
        cell: (props) => <ActionColumn row={props.row.original} />,
      },
    ],
    []
  );

  // PAGINATION — NO fetch needed, only updates table UI
  const onPaginationChange = (page: number) => {
    dispatch(setTableData({ ...tableData, pageIndex: page }));
  };

  const onSelectChange = (value: number) => {
    dispatch(setTableData({ ...tableData, pageSize: value, pageIndex: 1 }));
  };

  const onSort = (sortValue: OnSortParam) => {
    dispatch(setTableData({ ...tableData, sort: sortValue }));
  };

  return (
    <DataTable
      ref={tableRef}
      columns={columns}
      data={tenantList}
      loading={false}
      pagingData={{
        total: tenantList.length,
        pageIndex: tableData.pageIndex as number,
        pageSize: tableData.pageSize as number,
      }}
      onPaginationChange={onPaginationChange}
      onSelectChange={onSelectChange}
      onSort={onSort}
    />
  );
};

export default TenantTable;
