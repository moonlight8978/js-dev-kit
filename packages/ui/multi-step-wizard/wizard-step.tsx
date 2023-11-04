import { useEffect } from "react";
import type { AnyObject, ObjectSchema } from "yup";
import { useForm } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export interface StepDescriptor<T extends AnyObject> {
  validationSchema: ObjectSchema<T>;
  initialValues: T;
  render: (form: UseFormReturn<T>) => JSX.Element;
  key: string;
}

export function WizardStep<T extends AnyObject>({
  initialValues,
  render,
  validationSchema,
  hidden = false,
  onNextStep,
}: StepDescriptor<T> & {
  hidden: boolean;
  onNextStep: (values: T) => void;
}): JSX.Element {
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema),
  });

  const { formState, getValues } = form;
  const { isValid, isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isValid && isSubmitSuccessful) {
      onNextStep(getValues());
    }
  }, [isSubmitSuccessful, isValid, onNextStep, getValues]);

  return hidden || render(form);
}
