import React, { FC, ReactNode } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

const SelectForm: FC<{
  name: string;
  defaultValue?: string;
  control: Control<FieldValues>;
  label?: string;
  rules?:any;
  options?:any;
  error?:any;
}> = ({ control, name, defaultValue, label, options, rules , error }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm">{label}</label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field }) => (
          <select {...field} className="bg-white border border-gray-300 px-1 pe-3 py-2 rounded-md ">
              <option  className="bg-transparent text-gray-900"  value={""}>
                {label}
              </option>
            {options?.map((op : any, i : number) => (
              <option className="bg-transparent text-gray-900" key={i} value={op.id}>
                {t(op.name)}
              </option>
            ))}
          </select>
        )}
      />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

    </div>
  );
};

export default SelectForm;
