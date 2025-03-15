import { useEffect, useState } from "react";
import { useGetForms } from "../../apis/GetForms";
import FormBuilder from "../../components/FormBuilder";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormFieldType } from "../../types/FormFieldType.type";
import { usePostFormsSubmit } from "../../apis/PostFormsSubmit";
import { toast } from "react-toastify";

function Submit() {
  const [formFields, setFormFields] = useState<FormFieldType[]>([]);

  const { data: getFormsData, isSuccess: getFormsIsSuccess } = useGetForms();
  const { mutateAsync: postFormsSubmit } = usePostFormsSubmit();

  const formProvider = useForm({
    mode: "onChange",
    defaultValues: {
      insuranceType: "",
    },
  });

  useEffect(() => {
    formProvider.setValue("insuranceType", getFormsData?.[0]?.formId || "");
  }, [formProvider, getFormsData]);

  const { insuranceType } = useWatch({
    control: formProvider.control,
  });

  useEffect(() => {
    if (getFormsIsSuccess && getFormsData && insuranceType) {
      formProvider.reset({
        insuranceType: formProvider.getValues().insuranceType,
      });

      const selectedFormFields = getFormsData.find(
        (i) => i.formId === insuranceType,
      )!.fields;

      setFormFields(selectedFormFields);
    }
  }, [getFormsIsSuccess, getFormsData, insuranceType, formProvider]);

  const onSubmit = async (values: unknown) => {
    const { status } = await postFormsSubmit(values);
    if (status === "success") {
      toast.success("Form Submitted!");
    }
  };

  return (
    <>
      <FormProvider {...formProvider}>
        <form onSubmit={formProvider.handleSubmit(onSubmit)}>
          <div className="my-4">
            <h2 className="text-lg">Insurance Type</h2>
            <select
              className="border min-w-sm px-1 py-1"
              {...formProvider.register("insuranceType")}
            >
              {getFormsData?.map((i, index) => (
                <option key={index} value={i.formId}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>

          {formFields.map((i, index) => (
            <FormBuilder key={index} props={i} />
          ))}

          <button
            className="px-10 py-4 bg-green-300 transition-colors hover:bg-green-400 active:bg-green-400 focus:bg-green-400 cursor-pointer"
            type="submit"
          >
            Submit
          </button>
        </form>
      </FormProvider>

      <div className="my-10">
        {Object.values(formProvider.formState.errors).length > 0 &&
          Object.values(formProvider.formState.errors).map((i, index) => (
            <p key={index} className="text-red-500 text-sm">
              {String(i?.message)}
            </p>
          ))}
      </div>
    </>
  );
}

export default Submit;
