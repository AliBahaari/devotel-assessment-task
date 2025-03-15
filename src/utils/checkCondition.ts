type checkConditionProps = {
  dependsOn: string;
  condition: string;
  value: string;
  callbackFn: (param: string) => string;
};

export const checkCondition = ({
  dependsOn,
  condition,
  value,
  callbackFn,
}: checkConditionProps) => {
  switch (condition) {
    case "equals":
      return callbackFn(dependsOn) === value;
    default:
      throw new Error("Invalid Condition");
  }
};
