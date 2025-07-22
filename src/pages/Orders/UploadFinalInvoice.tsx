import React, { useState } from 'react';
import ImageGalleryInput from '../../components/UI/ImageGalleryInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import Input from '../../components/UI/Input';

const UploadFinalInvoice = ({ open, id, setOpen, refetch }: any) => {
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
            axios.post(`/orders/${id}/uploadFinalInvoice`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData = new FormData();
       if (formValues.file && typeof formValues.file !== 'string') {
            formData.append('final_invoice', formValues.file[0]);
        }
            formData.append('payment_info', formValues.payment_info);

        mutate(formData, {
            onSuccess: () => {
                toast.success(t('banners.addSuccess') as string);
                refetch();
                setOpen(false);
                reset();
                setAllFiles([]); // Clear files after success
            },
        });
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="text-center text-lg font-bold mb-4"> Upload Final Invoice</h1>

                    
                        <Input type="file" rules={{ required: `${t('required')}` }} error={errors?.[`file`]?.message as string} watch={watch} register={register} name="file" />
                        <Input type="text" watch={watch} register={register} name="payment_info" label="Payment Info" />

                        <div className="flex justify-end mt-6">
                            <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
                                {'cancel'}
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isPending}>
                                {isPending ? 'Loading'  : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default UploadFinalInvoice;
