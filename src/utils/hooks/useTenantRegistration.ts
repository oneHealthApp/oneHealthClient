import { useState } from "react";

import { useAppSelector } from "@/store";
import type { TenantCreatePayload, TenantFormData } from "@/@types/tenant";
import { apiCreateTenant } from "@/services/TenantService";

type Status = "idle" | "loading" | "success" | "error";

export default function useTenantRegistration() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Auth state
  const { accessToken, signedIn } = useAppSelector(
    (state) => state.auth.session
  );
  const user = useAppSelector((state) => state.auth.user);

  const registerTenant = async (formData: TenantFormData) => {
    try {
      setStatus("loading");
      setMessage("");

      // Auth check
      if (!signedIn || !accessToken) {
        throw new Error("Please login first to register a tenant");
      }

      console.log("Current auth state:", {
        signedIn,
        hasToken: !!accessToken,
        user: user.username,
      });

      // ============================
      // PAYLOAD TRANSFORMATION
      // ============================
      const payload: TenantCreatePayload = {
        name: formData.name,
        slug: formData.slug,
        isActive: formData.isActive,

        address: {
          address: formData.address,
          pin: formData.pin,
          state: formData.state,
          stateCode: formData.stateCode || "",
          district: formData.district,
          districtCode: formData.districtCode || "",
          subDistrict: formData.subDistrict,
          subDistrictCode: formData.subDistrictCode || "",
          town: formData.town,
          townCode: formData.townCode || "",
          countryId: formData.countryId || "IN",
          countryName: formData.countryName || "India",
          geoLocation: {},
        },
      };

      console.log("Sending tenant payload:", payload);

      // API CALL
      const response = await apiCreateTenant(payload);

      if (response.data && response.data.success) {
        setStatus("success");
        setMessage("Tenant created successfully!");

        return {
          success: true,
          data: response.data.data,
          message: "Tenant created successfully!",
        };
      } else {
        throw new Error("Tenant creation failed");
      }
    } catch (error: any) {
      setStatus("error");
      console.error("Tenant registration error:", error);

      let errorMessage = "Failed to create tenant";

      if (error?.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const resetStatus = () => {
    setStatus("idle");
    setMessage("");
  };

  return {
    status,
    message,
    registerTenant,
    resetStatus,
    isLoading: status === "loading",
    isSuccess: status === "success",
    isError: status === "error",

    // Auth state info
    isAuthenticated: signedIn && !!accessToken,
    currentUser: user.username,
  };
}
