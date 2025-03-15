import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../configs/axiosInstance";
import { TQ_QUERIES } from "../TQ_QUERIES";

type GetFormsSubmissionsResponse = {
  columns: string[];
  data: {
    id: string;
    "Full Name": string;
    Age: number;
    "Insurance Type": "Health" | "Home" | "Car";
    City: string;
    Gender: "Male" | "Female";
  }[];
};

export async function getFormsSubmissions() {
  const { data } = await axiosInstance.get<GetFormsSubmissionsResponse>(
    "/api/insurance/forms/submissions",
  );
  return data;
}

export function useGetFormsSubmissions() {
  return useQuery({
    queryKey: [TQ_QUERIES.GET_FORMS_SUBMISSIONS],
    queryFn: getFormsSubmissions,
  });
}
