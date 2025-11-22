import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

// ==========================
// VALIDATION
// ==========================
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Tenant name required"),
  slug: Yup.string().required("Slug required"),
  isActive: Yup.boolean(),
  pin: Yup.string().required("PIN required").length(6, "PIN must be 6 digits"),
  state: Yup.string().required("State required"),
  district: Yup.string().required("District required"),
  subDistrict: Yup.string().required("Taluka required"),
  town: Yup.string().required("Village required"),
  address: Yup.string().required("Full address required"),
});

// ==========================
// COMPONENT
// ==========================
export default function CreateTenant() {
  const [districtList, setDistrictList] = useState([]);
  const [talukaList, setTalukaList] = useState([]);
  const [villageList, setVillageList] = useState([]);

  // PIN → Address Autofill
  async function fetchPincode(pin, setFieldValue) {
    if (pin.length !== 6) return;

    try {
      const res = await fetch(
        `https://platform.shauryatechnosoft.com/core-master-service/api/v1/o/pincode?pincode=${pin}`
      );
      const { data } = await res.json();

      setDistrictList([data?.districtName]);
      setTalukaList(data?.talukaList || []);
      setVillageList(data?.villageList || []);

      setFieldValue("state", data?.stateName || "");
      setFieldValue("district", data?.districtName || "");
      setFieldValue("districtCode", data?.districtCode || "");
      setFieldValue("stateCode", data?.stateCode || "");
      setFieldValue("countryName", "India");
      setFieldValue("countryId", "IN");
    } catch (err) {
      console.log(err);
    }
  }

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

          // Address
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
          console.log("SUBMIT TENANT PAYLOAD:", values);
          alert(JSON.stringify(values, null, 2));
          resetForm();
        }}
      >
        {({ errors, touched, setFieldValue, resetForm }) => (
          <Form>
            <FormContainer>
              {/* ROW 1: BASIC DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Tenant Name */}
                <FormItem
                  label="Tenant Name"
                  invalid={errors.name && touched.name}
                  errorMessage={errors.name}
                >
                  <Field
                    name="name"
                    component={Input}
                    placeholder="Tenant name"
                  />
                </FormItem>

                {/* Slug */}
                <FormItem
                  label="Slug"
                  invalid={errors.slug && touched.slug}
                  errorMessage={errors.slug}
                >
                  <Field
                    name="slug"
                    component={Input}
                    placeholder="Unique slug"
                  />
                </FormItem>

                {/* Active? */}
                {/* <FormItem label="Status">
                  <Field
                    as="select"
                    name="isActive"
                    className="border p-2 rounded w-full"
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Field>
                </FormItem> */}
              </div>

              {/* ADDRESS SECTION */}
              <h2 className="text-xl font-semibold mt-6 mb-2">Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* PIN */}
                <FormItem
                  label="PIN Code"
                  invalid={errors.pin && touched.pin}
                  errorMessage={errors.pin}
                >
                  <Field
                    name="pin"
                    component={Input}
                    placeholder="PIN Code"
                    onChange={(e) => {
                      setFieldValue("pin", e.target.value);
                      fetchPincode(e.target.value, setFieldValue);
                    }}
                  />
                </FormItem>

                {/* State */}
                <FormItem
                  label="State"
                  invalid={errors.state && touched.state}
                  errorMessage={errors.state}
                >
                  <Field
                    name="state"
                    component={Input}
                    readOnly
                    className="bg-gray-100"
                  />
                </FormItem>

                {/* District */}
                <FormItem
                  label="District"
                  invalid={errors.district && touched.district}
                  errorMessage={errors.district}
                >
                  <Field
                    as="select"
                    name="district"
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select District</option>
                    {districtList.map((d, i) => (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    ))}
                  </Field>
                </FormItem>

                {/* Taluka */}
                <FormItem
                  label="Taluka"
                  invalid={errors.subDistrict && touched.subDistrict}
                  errorMessage={errors.subDistrict}
                >
                  <Field
                    as="select"
                    name="subDistrict"
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Taluka</option>
                    {talukaList.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </Field>
                </FormItem>

                {/* Village */}
                <FormItem
                  label="Village"
                  invalid={errors.town && touched.town}
                  errorMessage={errors.town}
                >
                  <Field
                    as="select"
                    name="town"
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Village</option>
                    {villageList.map((v, i) => (
                      <option key={i} value={v}>
                        {v}
                      </option>
                    ))}
                  </Field>
                </FormItem>

                {/* Full Address */}
                <FormItem
                  label="Full Address"
                  invalid={errors.address && touched.address}
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
