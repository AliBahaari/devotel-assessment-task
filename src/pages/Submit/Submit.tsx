import { useEffect, useState } from "react";
import { useGetForms } from "../../apis/GetForms";
import FormBuilder from "../../components/FormBuilder";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormFieldType } from "../../types/FormFieldType.type";
import { usePostFormsSubmit } from "../../apis/PostFormsSubmit";
import { toast } from "react-toastify";
import { Reorder } from "motion/react";
import { translations } from "../../configs/translations";
import { useLocalizationStore } from "../../stores/useLocalizationStore";

function Submit() {
  const language = useLocalizationStore((state) => state.language);

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
      toast.success(`${translations[language].form_submitted}!`);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        {Object.values(formProvider.formState.errors).length > 0 &&
          Object.values(formProvider.formState.errors).map((i, index) => (
            <p key={index} className="text-red-500 text-sm">
              {String(i?.message)}
            </p>
          ))}
      </div>

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

          <Reorder.Group axis="y" values={formFields} onReorder={setFormFields}>
            {formFields.map((i) => (
              <Reorder.Item key={i.id} value={i}>
                <FormBuilder props={i} />
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <button
            className="px-10 py-4 bg-green-400 transition-colors rounded-sm hover:bg-green-500 active:bg-green-500 focus:bg-green-500 cursor-pointer"
            type="submit"
          >
            {translations[language].submit}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Submit;
