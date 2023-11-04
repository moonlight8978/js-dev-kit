import { useEffect, useRef, useState } from "react";
import { WizardStep } from "./wizard-step";
import type { StepDescriptor } from "./wizard-step";

export * from "./wizard-step";

export function MultiStepWizard({
  steps,
  onSubmit = () => {},
}: {
  steps: StepDescriptor<any>[];
  onSubmit?: (values: any) => any;
}): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);

  const formIndexToValues = useRef<Map<number, any>>(new Map());

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  useEffect(() => {
    if (currentStep === steps.length) {
      onSubmitRef.current(formIndexToValues.current);
    }
  }, [currentStep, steps]);

  return steps.map((step, index) => {
    return (
      <WizardStep
        {...step}
        key={step.key}
        hidden={index !== currentStep}
        onNextStep={(values) => {
          formIndexToValues.current.set(index, values);
          setCurrentStep(index + 1);
        }}
      />
    );
  });
}
