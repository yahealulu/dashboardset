import React, { useState } from 'react';
import ImageGalleryInput from '../../components/UI/ImageGalleryInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import SelectForm from '../../components/UI/Select';
const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Waiting For Shipment', value: 'waiting_for_shipment' },
    { label: 'Document Uploaded', value: 'document-uploaded' },
    { label: 'Admin Approved', value: 'admin_approved' },
    { label: 'Admin Not Approved', value: 'admin_not_approved' },
    { label: 'Final Invoice Sent', value: 'final_invoice_sent' },
    { label: 'User Approved', value: 'user_approved' },
    { label: 'User Not Approved', value: 'user_not_approved' },
    { label: 'Waiting Payment', value: 'waiting_payment' },
    { label: 'Waiting For Shipment', value: 'waiting_for_shipment' },
    { label: 'Finished', value: 'finished' },
    { label: 'Freezed', value: 'freezed' },
];
const UpdateStatus = ({ open, id, setOpen, refetch }: any) => {
    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        formState: { errors },
    } = useForm();
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const { t } = useTranslation();

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormData) => axios.post(`/orders/${id}`, data),
    });

    const onSubmit: SubmitHandler<any> = () => {
        const formData = new FormData();
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
                setAllFiles([]); // Clear files after success
            },
        });
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="text-center text-lg font-bold mb-4"> Update Status</h1>

                        <SelectForm control={control} options={statusOptions} name="status"  />

                        <div className="flex justify-end mt-6">
                            <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
                                {t('common.cancel')}
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isPending}>
                                {isPending ? t('common.loading') || 'Adding...' : t('common.add') || 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default UpdateStatus;
