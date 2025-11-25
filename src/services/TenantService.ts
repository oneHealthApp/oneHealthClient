import ApiService from "./ApiService";
import { TenantCreatePayload } from "@/@types/tenant";

export async function apiCreateTenant(data: TenantCreatePayload) {
  return ApiService.fetchData<TenantCreatePayload>({
    url: "/clinics",
    method: "post",
    data,
  });
}
