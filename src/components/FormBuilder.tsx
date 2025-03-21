import { useFormContext } from "react-hook-form";
import { useGetDynamicData } from "../apis/GetDynamicData";
import { FormFieldType } from "../types/FormFieldType.type";
import { checkCondition } from "../utils/checkCondition";
import { useEffect } from "react";
import { useDarkModeStore } from "../stores/useDarkModeStore";
import { translations } from "../configs/translations";
import { useLocalizationStore } from "../stores/useLocalizationStore";

type FormBuilderProps = {
  props: FormFieldType;
};

function FormBuilder({ props }: FormBuilderProps) {
  const darkMode = useDarkModeStore((state) => state.darkMode);
  const language = useLocalizationStore((state) => state.language);

  const { register, watch, setValue } = useFormContext();

  const { data: getDynamicData } = useGetDynamicData({
    allowed: "dynamicOptions" in props,
    dependsOn: props.dynamicOptions && props.dynamicOptions.dependsOn,
    endpoint: props.dynamicOptions && props.dynamicOptions.endpoint,
    method: props.dynamicOptions && props.dynamicOptions.method,
    value: props.dynamicOptions && watch(props.dynamicOptions.dependsOn),
  });

  useEffect(() => {
    if (props.type === "select") {
      if (props.dynamicOptions) {
        setValue(props.id, getDynamicData?.states[0]);
      } else if (props.options) {
        setValue(props.id, props.options[0]);
      }
    } else if (props.type === "number") {
      setValue(props.id, 0);
    }
  }, [
    getDynamicData?.states,
    props.dynamicOptions,
    props.id,
    props.options,
    props.type,
    setValue,
  ]);

  const fieldSchema = {
    radio: (
      <>
        <h2 className="text-lg">{props.label}</h2>
        {props.options?.map((i, index) => (
          <div key={index} className="flex flex-row items-center gap-1">
            <label>{i}</label>
            <input
              type="radio"
              value={i}
              {...register(props.id, {
                required: {
                  value: props.required,
                  message: `"${props.label}" ${translations[language].should_be_filled}.`,
                },
              })}
            />
          </div>
        ))}
      </>
    ),
    checkbox: (
      <>
        <h2 className="text-lg">{props.label}</h2>
        {props.options?.map((i, index) => (
          <div key={index} className="flex flex-row items-center gap-1">
            <label>{i}</label>
            <input type="checkbox" value={i} {...register(props.id)} />
          </div>
        ))}
      </>
    ),
    select: (
      <>
        <h2 className="text-lg">{props.label}</h2>
        <select
          className={`border w-xs sm:w-lg px-1 py-1 ${darkMode && "text-gray-400 border-white"}`}
          {...register(props.id, {
            required: {
              value: props.required,
              message: `"${props.label}" ${translations[language].should_be_filled}.`,
            },
          })}
        >
          {props.dynamicOptions
            ? getDynamicData?.states?.map((i: string, index: number) => (
                <option key={index} value={i}>
                  {i}
                </option>
              ))
            : props.options?.map((i, index) => (
                <option key={index} value={i}>
                  {i}
                </option>
              ))}
        </select>
      </>
    ),
    text: (
      <>
        <h2 className="text-lg">{props.label}</h2>
        <input
          className="border w-xs sm:w-lg px-1 py-1"
          type="text"
          {...register(props.id, {
            required: {
              value: props.required,
              message: `"${props.label}" ${translations[language].should_be_filled}.`,
            },
            ...(props.validation?.pattern && {
              pattern: {
                value: new RegExp(props.validation?.pattern),
                message: `"${props.label}" ${translations[language].should_be_followed_by} ${props.validation.pattern}.`,
              },
            }),
          })}
        />
      </>
    ),
    date: (
      <>
        <h2 className="text-lg">{props.label}</h2>
        <input
          className="border w-xs sm:w-lg px-1 py-1"
          type="date"
          {...register(props.id, {
            required: {
              value: props.required,
              message: `"${props.label}" ${translations[language].should_be_filled}.`,
            },
          })}
        />
      </>
    ),
    number: (
      <>
        <h2 className="text-lg">{props.label}</h2>
        <input
          className="border w-xs sm:w-lg px-1 py-1"
          type="number"
          {...register(props.id, {
            required: {
              value: props.required,
              message: `"${props.label}" ${translations[language].should_be_filled}.`,
            },
            min: {
              value: Number(props.validation?.min),
              message: `"${props.label}" ${translations[language].minimum_is} ${props.validation?.min}.`,
            },
            max: {
              value: Number(props.validation?.max),
              message: `"${props.label}" ${translations[language].maximum_is} ${props.validation?.max}.`,
            },
          })}
        />
      </>
    ),
    group: (
      <>
        <h3 className="text-xl">- {props.label}</h3>
        {props.fields?.map((i, index) => <FormBuilder key={index} props={i} />)}
      </>
    ),
  };

  return (
    <>
      {props.visibility ? (
        checkCondition({
          dependsOn: props.visibility.dependsOn,
          condition: props.visibility.condition,
          value: props.visibility.value,
          callbackFn: watch,
        }) && <div className="my-4">{fieldSchema[props.type]}</div>
      ) : (
        <div className="my-4">{fieldSchema[props.type]}</div>
      )}
    </>
  );
}

export default FormBuilder;
