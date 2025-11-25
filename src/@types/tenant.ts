export type Address = {
  id: string;
  address: string;
  townCode: string;
  town: string;
  pin: string;
  subDistrictCode: string;
  subDistrict: string;
  districtCode: string;
  district: string;
  stateCode: string;
  state: string;
  countryId: string;
  countryName: string;
  geoLocation?: any | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
};

export type ListItemData = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  address?: string | null;
};

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  addressId?: string | null;
  address?: Address | null;
};

export interface TenantFormData {
  name: string;
  slug: string;
  isActive: boolean;

  pin: string;
  state: string;
  stateCode: string;
  district: string;
  districtCode: string;
  subDistrict: string;
  subDistrictCode: string;
  town: string;
  townCode: string;
  address: string;
  countryId: string;
  countryName: string;
}

export interface TenantCreatePayload {
  name: string;
  slug: string;
  isActive: boolean;
  address: {
    address: string;
    pin: string;
    state: string;
    stateCode: string;
    district: string;
    districtCode: string;
    subDistrict: string;
    subDistrictCode: string;
    town: string;
    townCode: string;
    countryId: string;
    countryName: string;
    geoLocation: object;
  };
}
