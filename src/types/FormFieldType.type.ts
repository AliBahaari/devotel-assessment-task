export type FormFieldType = {
  id: string;
  label: string;
  type: "radio" | "checkbox" | "select" | "text" | "date" | "number" | "group";
  required: boolean;
  options?: string[];
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
    method: string;
  };
  visibility?: {
    dependsOn: string;
    condition: string;
    value: string;
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  fields?: Array<FormFieldType>;
};
