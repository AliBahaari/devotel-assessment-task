import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../configs/axiosInstance";
import { TQ_QUERIES } from "../TQ_QUERIES";

type GetDynamicDataProps = {
  allowed: boolean;
  dependsOn: string | undefined;
  endpoint: string | undefined;
  method: string | undefined;
  value: string | undefined;
};

export function useGetDynamicData({
  allowed,
  dependsOn,
  endpoint,
  method,
  value,
}: GetDynamicDataProps) {
  return useQuery({
    queryKey: [TQ_QUERIES.GET_DYNAMIC_DATA, value],
    queryFn: async () => {
      const { data } = await axiosInstance({
        url: `${endpoint}?${dependsOn}=${value}`,
        method,
      });
      return data;
    },
    enabled: allowed && !!value,
  });
}
