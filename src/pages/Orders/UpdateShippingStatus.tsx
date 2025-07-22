import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import ImageGalleryInput from '../../components/UI/ImageGalleryInput';
import Input from '../../components/UI/Input';

const UpdateShippingStatus = ({ open, id, setOpen, refetch }: any) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const { t } = useTranslation();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormData) =>
            axios.post(`/orders/${id}/upload-shipment-files`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData = new FormData();
        
        // Add status
        formData.append('status', 'waiting_shipping');
        
        // Add tracking URL
        formData.append('tracking_url', formValues.tracking_url);

        // Add shipment files
        allFiles.forEach((file, i) => {
            if (typeof file !== 'string') {
                formData.append(`shipment_files[${i}]`, file);
            }
        });

        mutate(formData, {
            onSuccess: () => {
                toast.success(t('banners.addSuccess') as string);
                refetch();
                setOpen(false);
                reset();
                setAllFiles([]);
            },
        });
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="text-center text-lg font-bold mb-4">Update Shipping Status</h1>

                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                                <p className="text-sm text-blue-600 dark:text-blue-200">
                                    Status will be updated to: <span className="font-semibold">Waiting Shipping</span>
                                </p>
                            </div>

                            <Input 
                                type="text"
                                name="tracking_url"
                                label="Tracking URL"
                                register={register}
                                rules={{ 
                                    required: 'Tracking URL is required',
                                    pattern: {
                                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                        message: 'Please enter a valid URL'
                                    }
                                }}
                                error={errors?.tracking_url?.message as string}
                            />

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Shipment Files
                                </label>
                                <ImageGalleryInput
                                    classNameParent="w-full"
                                    allFiles={allFiles}
                                    setAllFiles={setAllFiles}
                                    name="gallery"
                                    register={register}
                                    watch={watch}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                disabled={isPending}
                            >
                                {isPending ? t('common.loading') : t('common.update')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default UpdateShippingStatus; 