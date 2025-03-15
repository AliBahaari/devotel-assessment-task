import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../configs/axiosInstance";

type PostFormsSubmitRequest = unknown;
type PostFormsSubmitResponse = {
  status: string;
  message: string;
};

export async function postFormsSubmit(
  postFormsSubmitRequest: PostFormsSubmitRequest,
) {
  const { data } = await axiosInstance.post<PostFormsSubmitResponse>(
    "/api/insurance/forms/submit",
    postFormsSubmitRequest,
  );
  return data;
}

export function usePostFormsSubmit() {
  return useMutation({
    mutationFn: (postFormsSubmitRequest: PostFormsSubmitRequest) =>
      postFormsSubmit(postFormsSubmitRequest),
  });
}
