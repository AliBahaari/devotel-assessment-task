import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../configs/axiosInstance";
import { TQ_QUERIES } from "../TQ_QUERIES";
import { FormFieldType } from "../../types/FormFieldType.type";

type GetFormsResponse = [
  {
    formId: string;
    title: string;
    fields: FormFieldType[];
  },
];

export async function getForms() {
  const { data } = await axiosInstance.get<GetFormsResponse>(
    "/api/insurance/forms",
  );
  return data;
}

export function useGetForms() {
  return useQuery({
    queryKey: [TQ_QUERIES.GET_FORMS],
    queryFn: getForms,
  });
}
