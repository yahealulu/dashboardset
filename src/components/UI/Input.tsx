import React, { FC } from 'react';
import { FieldValues, RegisterOptions, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { imgUrl } from '../../Api/axios';
import { useTranslation } from 'react-i18next';
import { FaFilePdf } from 'react-icons/fa';

const Input: FC<{
    name: string;
    label?: string;
    type?: string;
    register: UseFormRegister<FieldValues>;
    rules?: any;
    watch?: UseFormWatch<FieldValues>;
    isPdf?: boolean;
    error?: any;
    accept?: string;
}> = ({ name, label, register, rules, type, watch, error, accept, isPdf }) => {
    const watchedImage = watch?.(name);
    const imageFile = watchedImage && watchedImage[0];
    const { t } = useTranslation();

    const handlePreviewClick = () => {
        if (imageFile && isPdf) {
            window.open(URL.createObjectURL(imageFile), '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`flex items-start gap-4 w-full ${imageFile ? 'col-span-2' : ''}`}>
            <div className="flex flex-col w-full">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                <input
                    id={name}
                    accept={".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xlsx"}
                    type={type || 'text'}
                    placeholder={type === 'file' ? '' : `${t('Enter')} ${label}`}
                    {...register(name, rules)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            {type === 'file' && imageFile && !isPdf && (
                <img
                    className="mt-2 h-32 w-32 rounded object-cover"
                    src={typeof watchedImage === 'string' ? `${imgUrl}/${watchedImage}` : URL.createObjectURL(imageFile)}
                    alt=""
                />
            )}
            {type === 'file' && imageFile && isPdf && (
                <div 
                    onClick={handlePreviewClick}
                    className="flex items-center gap-2 p-3 mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                    <FaFilePdf size={24} className="text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {imageFile.name}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Input;
