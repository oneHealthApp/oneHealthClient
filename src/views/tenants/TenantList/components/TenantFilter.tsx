import { useState, useRef, forwardRef } from "react";
import { HiOutlineFilter, HiOutlineSearch } from "react-icons/hi";

import { FormItem, FormContainer } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Drawer from "@/components/ui/Drawer";

import { Field, Form, Formik, FormikProps, FieldProps } from "formik";
import type { MouseEvent } from "react";

import { RootState, getTenants, useAppDispatch, useAppSelector } from "@/store";
import { initialTableData } from "@/store/slices/tenant/tenantListSlice";

type FormModel = {
  name: string;
  status: string[];
  category: string[];
};

type FilterFormProps = {
  onSubmitComplete?: () => void;
};

type DrawerFooterProps = {
  onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancel: (event: MouseEvent<HTMLButtonElement>) => void;
};

// FILTER FORM ----------------------------------------------------

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
  ({ onSubmitComplete }, ref) => {
    const dispatch = useAppDispatch();

    const filterData = useAppSelector(
      (state: RootState) => state.tenantList.filterData
    );

    const handleSubmit = (values: FormModel) => {
      onSubmitComplete?.();

      // Update Redux filter data here if needed
      // dispatch(setFilterData(values));

      dispatch(getTenants(initialTableData));
    };

    return (
      <Formik
        enableReinitialize
        innerRef={ref}
        initialValues={filterData}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, touched, errors }) => (
          <Form>
            <FormContainer>
              {/* TENANT NAME SEARCH */}
              <FormItem
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <h6 className="mb-2 font-semibold">Tenant Name</h6>
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Search by name"
                  component={Input}
                  prefix={<HiOutlineSearch className="text-lg" />}
                />
              </FormItem>

              {/* CATEGORY FILTER */}
              <FormItem
                invalid={errors.category && touched.category}
                errorMessage={errors.category as string}
              >
                <h6 className="mb-2 font-semibold">Category</h6>
                <Field name="category">
                  {({ field, form }: FieldProps) => (
                    <Checkbox.Group
                      vertical
                      value={values.category}
                      onChange={(options) =>
                        form.setFieldValue(field.name, options)
                      }
                    >
                      <Checkbox value="Tenant" name={field.name}>
                        Tenant
                      </Checkbox>
                      <Checkbox value="Clinic" name={field.name}>
                        Clinic
                      </Checkbox>
                    </Checkbox.Group>
                  )}
                </Field>
              </FormItem>

              {/* STATUS FILTER */}
              <FormItem
                invalid={errors.status && touched.status}
                errorMessage={errors.status as string}
              >
                <h6 className="mb-2 font-semibold">Status</h6>
                <Field name="status">
                  {({ field, form }: FieldProps) => (
                    <Checkbox.Group
                      vertical
                      value={values.status}
                      onChange={(options) =>
                        form.setFieldValue(field.name, options)
                      }
                    >
                      <Checkbox value="Active" name={field.name}>
                        Active
                      </Checkbox>
                      <Checkbox value="Inactive" name={field.name}>
                        Inactive
                      </Checkbox>
                    </Checkbox.Group>
                  )}
                </Field>
              </FormItem>
            </FormContainer>
          </Form>
        )}
      </Formik>
    );
  }
);

FilterForm.displayName = "FilterForm";

// FOOTER ---------------------------------------------------------

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
  return (
    <div className="text-right w-full">
      <Button size="sm" className="mr-2" onClick={onCancel}>
        Cancel
      </Button>
      <Button size="sm" variant="solid" onClick={onSaveClick}>
        Apply Filters
      </Button>
    </div>
  );
};

// MAIN FILTER COMPONENT ------------------------------------------

const TenantFilter = () => {
  const formikRef = useRef<FormikProps<FormModel>>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const onDrawerClose = () => setIsOpen(false);
  const formSubmit = () => formikRef.current?.submitForm();

  return (
    <>
      <Button
        size="sm"
        className="block md:inline-block md:ltr:ml-2 md:rtl:mr-2 md:mb-0 mb-4"
        icon={<HiOutlineFilter />}
        onClick={openDrawer}
      >
        Filter
      </Button>

      <Drawer
        title="Tenant Filters"
        isOpen={isOpen}
        footer={
          <DrawerFooter onCancel={onDrawerClose} onSaveClick={formSubmit} />
        }
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
      </Drawer>
    </>
  );
};

export default TenantFilter;
