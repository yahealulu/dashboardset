import React, { FC } from "react";
import Select from "react-select";
import { Control, Controller, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

type Option = { name: string; id: string };

const SelectFormMulti: FC<{
  name: string;
  defaultValue?: string | string[];
  control:any;
  label?: string;
  options?: Option[];
  multi?: boolean;
  rules?: any;
  error?: any;
}> = ({ control, name, defaultValue, label, options = [], multi = false, rules, error }) => {
  const { t } = useTranslation();

  const formattedOptions = options.map((op) => ({
    value: op.id,
    label: t(op.name),
  }));

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm">{label}</label>}
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            options={formattedOptions}
            isMulti={multi}
            className="basic-multi-select"
            classNamePrefix="select"
            value={
              multi
                ? formattedOptions.filter((opt) => field.value?.includes(opt.value))
                : formattedOptions.find((opt) => opt.value === field.value) || null
            }
            onChange={(selected: any) => {
              if (multi) {
                field.onChange((selected as any[])?.map((opt) => opt.value));
              } else {
                field.onChange((selected as any)?.value || "");
              }
            }}
          />
        )}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
};

export default SelectFormMulti;
