import { useMemo } from "react";
import type { StepDescriptor } from "@moonlight8978/ui";
import { MultiStepWizard } from "@moonlight8978/ui";
import { boolean, object, string } from "yup";
import { Controller, type UseFormReturn } from "react-hook-form";

interface Step1Values {
  acceptTos: boolean;
}

interface Step2Values {
  email: string;
  password: string;
}

const Step1Form = (props: {
  form: UseFormReturn<Step1Values>;
}): JSX.Element => {
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
            <label htmlFor={field.name}>Accept the term of services</label>
          </div>
        )}
      />

      <button type="submit">Continue</button>
    </form>
  );
};

const Step2Form = (props: {
  form: UseFormReturn<Step2Values>;
}): JSX.Element => {
  const { form } = props;
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={form.handleSubmit(() => {})}>
      <div>Login</div>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name}>Email</label>
            <input type="text" {...field} />
          </div>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name}>Passord</label>
            <input type="password" {...field} />
          </div>
        )}
      />

      <button type="submit">Login</button>
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
        key: "tos",
      } as StepDescriptor<Step1Values>,
      {
        initialValues: {
          email: "",
          password: "",
        },
        key: "login",
        render: (form) => <Step2Form form={form} />,
        validationSchema: step2ValidationSchema,
      } as StepDescriptor<Step2Values>,
    ],
    [step1ValidationSchema, step2ValidationSchema]
  );

  return <MultiStepWizard steps={steps} />;
};

export default SimpleMultiStepWizard;
