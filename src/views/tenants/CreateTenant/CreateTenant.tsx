import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ====== PIN API RETURN TYPE (Tenant version still uses same structure) ======
interface PincodeData {
  districtName: string;
  districtCode: string;
  stateName: string;
  stateCode: string;

  talukaList: { name: string; code: string }[];
  villageList: { name: string; code: string }[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tenant name required"),
  slug: Yup.string().required("Slug required"),

  pin: Yup.string().required("PIN required").length(6, "PIN must be 6 digits"),
  state: Yup.string().required("State required"),
  district: Yup.string().required("District required"),
  subDistrict: Yup.string().required("Taluka required"),
  town: Yup.string().required("Village required"),
  address: Yup.string().required("Full address required"),
});

export default function CreateTenant() {
  const [locationData, setLocationData] = useState<PincodeData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedTaluka, setSelectedTaluka] = useState("");

  // ====== Fetch PIN ======
  async function fetchPincode(pin: string, setFieldValue: any) {
    if (pin.length !== 6) {
      setLocationData(null);
      return;
    }

    try {
      const res = await fetch(
        `https://platform.shauryatechnosoft.com/core-master-service/api/v1/o/pincode?pincode=${pin}`
      );

      const { data } = await res.json();

      if (!data) return;

      setLocationData(data);

      // AUTOFILL STATE, DISTRICT
      setFieldValue("state", data.stateName);
      setFieldValue("stateCode", data.stateCode);

      setFieldValue("district", data.districtName);
      setFieldValue("districtCode", data.districtCode);

      setSelectedDistrict(data.districtName);

      // Reset next levels
      setFieldValue("subDistrict", "");
      setFieldValue("town", "");
      setSelectedTaluka("");

      setFieldValue("countryId", "IN");
      setFieldValue("countryName", "India");
    } catch (e) {
      console.log("PIN API Error:", e);
    }
  }

  // ====== DISTRICT LIST (only 1 in this API) ======
  const getDistricts = () => {
    if (!locationData) return [];
    return [locationData.districtName];
  };

  // ====== TALUKA LIST ======
  const getTalukas = () => {
    if (!locationData) return [];
    return locationData.talukaList.map((t) => t.name);
  };

  // ====== VILLAGE LIST (filtered by selected taluka if needed) ======
  const getVillages = () => {
    if (!locationData) return [];
    return locationData.villageList.map((v) => v.name);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        Tenant Registration
      </h1>

      <Formik
        initialValues={{
          name: "",
          slug: "",
          isActive: true,

          pin: "",
          state: "",
          stateCode: "",
          district: "",
          districtCode: "",
          subDistrict: "",
          subDistrictCode: "",
          town: "",
          townCode: "",
          address: "",
          countryName: "",
          countryId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log("TENANT PAYLOAD:", values);
          alert("Tenant submitted!");
          resetForm();
          setLocationData(null);
          setSelectedDistrict("");
          setSelectedTaluka("");
        }}
      >
        {({ errors, touched, setFieldValue, resetForm }) => (
          <Form>
            <FormContainer>
              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormItem
                  label="Tenant Name"
                  invalid={!!errors.name && touched.name}
                  errorMessage={errors.name}
                >
                  <Field
                    name="name"
                    component={Input}
                    placeholder="Tenant name"
                  />
                </FormItem>

                <FormItem
                  label="Slug"
                  invalid={!!errors.slug && touched.slug}
                  errorMessage={errors.slug}
                >
                  <Field
                    name="slug"
                    component={Input}
                    placeholder="tenant-slug"
                  />
                </FormItem>

                <FormItem label="Status">
                  <Field
                    as="select"
                    name="isActive"
                    className="border p-2 rounded w-full"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                </FormItem>
              </div>

              {/* ADDRESS */}
              <h2 className="text-xl font-semibold mt-6 mb-2">Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* PIN */}
                <FormItem
                  label="PIN Code"
                  invalid={!!errors.pin && touched.pin}
                  errorMessage={errors.pin}
                >
                  <Field
                    name="pin"
                    component={Input}
                    placeholder="PIN Code"
                    onChange={(e: any) => {
                      setFieldValue("pin", e.target.value);
                      fetchPincode(e.target.value, setFieldValue);
                    }}
                  />
                </FormItem>

                {/* STATE */}
                <FormItem
                  label="State"
                  invalid={!!errors.state && touched.state}
                  errorMessage={errors.state}
                >
                  <Field
                    name="state"
                    component={Input}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormItem>

                {/* DISTRICT */}
                <FormItem
                  label="District"
                  invalid={!!errors.district && touched.district}
                  errorMessage={errors.district}
                >
                  <Field
                    as="select"
                    name="district"
                    className="border p-2 rounded w-full"
                    onChange={(e: any) => {
                      const val = e.target.value;
                      setFieldValue("district", val);
                      setSelectedDistrict(val);

                      if (locationData?.districtName === val) {
                        setFieldValue(
                          "districtCode",
                          locationData.districtCode
                        );
                      }

                      // Reset
                      setFieldValue("subDistrict", "");
                      setFieldValue("town", "");
                      setSelectedTaluka("");
                    }}
                  >
                    <option value="">Select District</option>
                    {getDistricts().map((d, i) => (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    ))}
                  </Field>
                </FormItem>

                {/* TALUKA */}
                <FormItem
                  label="Taluka"
                  invalid={!!errors.subDistrict && touched.subDistrict}
                  errorMessage={errors.subDistrict}
                >
                  <Field
                    as="select"
                    name="subDistrict"
                    className="border p-2 rounded w-full"
                    onChange={(e: any) => {
                      const val = e.target.value;
                      setFieldValue("subDistrict", val);
                      setSelectedTaluka(val);

                      const match = locationData?.talukaList.find(
                        (t) => t.name === val
                      );
                      setFieldValue("subDistrictCode", match?.code || "");

                      setFieldValue("town", "");
                    }}
                  >
                    <option value="">Select Taluka</option>
                    {getTalukas().map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </Field>
                </FormItem>

                {/* VILLAGE */}
                <FormItem
                  label="Village"
                  invalid={!!errors.town && touched.town}
                  errorMessage={errors.town}
                >
                  <Field
                    as="select"
                    name="town"
                    className="border p-2 rounded w-full"
                    onChange={(e: any) => {
                      const val = e.target.value;
                      setFieldValue("town", val);

                      const match = locationData?.villageList.find(
                        (v) => v.name === val
                      );
                      setFieldValue("townCode", match?.code || "");
                    }}
                  >
                    <option value="">Select Village</option>
                    {getVillages().map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </Field>
                </FormItem>

                {/* ADDRESS */}
                <FormItem
                  label="Full Address"
                  invalid={!!errors.address && touched.address}
                  errorMessage={errors.address}
                >
                  <Field
                    name="address"
                    component={Input}
                    placeholder="Full address"
                  />
                </FormItem>
              </div>

              {/* BUTTONS */}
              <FormItem className="mt-6">
                <Button
                  type="reset"
                  className="mr-3"
                  onClick={() => resetForm()}
                >
                  Reset
                </Button>
                <Button variant="solid" type="submit">
                  Submit
                </Button>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}
