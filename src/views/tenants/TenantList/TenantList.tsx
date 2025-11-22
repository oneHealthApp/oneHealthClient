import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import ListItem from "./components/ListItem";
import { AdaptableCard, Loading } from "@/components/shared";
import { getTenants, useAppDispatch } from "@/store";
import TenantTableTools from "./components/TenantTableTools";
import TenantTable from "./components/TenantTable";

function TenantList() {
  const dispatch = useAppDispatch();

  const tenantList = useSelector(
    (state: any) => state.tenantList.tenantList || []
  );

  const loading = useSelector(
    (state: any) => state.tenantList.loading || false
  );

  console.log("tenantList:", tenantList); // should be an array now

  useEffect(() => {
    dispatch(getTenants());
  }, [dispatch]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      {/* {tenantList.map((tenant: any) => (
        <ListItem key={tenant.id} cardBorder data={tenant} />
      ))} */}

      <AdaptableCard className="h-full" bodyClass="h-full">
        <div className="lg:flex items-center justify-between mb-4">
          <h3 className="mb-4 lg:mb-0">Tenants</h3>
          <TenantTableTools />
        </div>
        <TenantTable />
      </AdaptableCard>
    </div>
  );
}

export default TenantList;
