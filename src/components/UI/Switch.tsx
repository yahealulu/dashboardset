import React, { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

const Switch: FC<{
    control: Control<any, any, any>;
    label:string;
    name:string;
}> = ({ control  , label , name}) => {
    return (
        <div className="flex flex-col items-center  mt-4">
            <label className="text-gray-700 dark:text-white" htmlFor="isActive">
               {label}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field: { value, onChange } }) => (
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-500 relative">
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
                        </div>
                    </label>
                )}
            />
        </div>
    );
};

export default Switch;
