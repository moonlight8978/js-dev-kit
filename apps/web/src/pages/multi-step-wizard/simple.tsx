import React, { useMemo } from "react";
import { MultiStepWizard, StepDescriptor } from "@moonlight8978/ui";
import { boolean, object, string } from "yup";
import { Controller, type UseFormReturn } from "react-hook-form";

interface Step1Values {
  acceptTos: boolean;
}

interface Step2Values {
  email: string;
  password: string;
}

const Step1Form = (props: { form: UseFormReturn<Step1Values> }) => {
  const { form } = props;
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <div>TOS</div>

      <Controller
        name="acceptTos"
        control={control}
        render={({ field }) => (
          <div>
            <input type="checkbox" {...field} value={field.value ? "1" : "0"} />
            <label>Accept the term of services</label>
          </div>
        )}
      />
    </form>
  );
};

const SimpleMultiStepWizard = () => {
  const step1ValidationSchema = useMemo(
    () =>
      object({
        acceptTos: boolean()
          .required()
          .oneOf([true], "You must accept the terms and conditions"),
      }),
    []
  );

  const step2ValidationSchema = useMemo(
    () =>
      object({
        email: string().required("Email is required"),
        passord: string().required("Password is required"),
      }),
    []
  );

  const steps = useMemo(
    () => [
      {
        initialValues: {
          acceptTos: false,
        },
        render: (form) => <Step1Form form={form} />,
        validationSchema: step1ValidationSchema,
      } as StepDescriptor<Step1Values>,
    ],
    [step1ValidationSchema, step2ValidationSchema]
  );

  return <MultiStepWizard steps={steps} />;
};

export default SimpleMultiStepWizard;
