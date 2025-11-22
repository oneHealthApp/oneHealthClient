import Button from "@/components/ui/Button";
import { HiDownload, HiPlusCircle } from "react-icons/hi";

import { Link, useNavigate } from "react-router-dom";
import TenantTableSearch from "./TenantTableSearch";
import TenantFilter from "./TenantFilter";

const TenantTableTools = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row lg:items-center">
      <TenantTableSearch />
      <TenantFilter />
      <Link
        download
        className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
        to="/data/product-list.csv"
        target="_blank"
      >
        <Button block size="sm" icon={<HiDownload />}>
          Export
        </Button>
      </Link>
      <Link className="block lg:inline-block md:mb-0 mb-4" to="/tenants/create">
        <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
          Add Tenant
        </Button>
      </Link>
    </div>
  );
};

export default TenantTableTools;
