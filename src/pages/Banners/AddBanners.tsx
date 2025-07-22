import { QueryObserverResult, RefetchOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Input from '../../components/UI/Input';
import axios from '../../Api/axios';
import Switch from '../../components/UI/Switch';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AddBanners: FC<{
    open: boolean;
    setOpen: (arg: boolean) => void;
    className?: string;
    id: any;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
    setSelctedData: any;
    selectdData: any;
}> = ({ open, setOpen, id, selectdData, setSelctedData }) => {
    const { t } = useTranslation();
    const {
        register,
        watch,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            isActive: true,
        },
    });

    useEffect(() => {
        if (selectdData) {
            const defaultValues: any = {};
            defaultValues['image'] = selectdData.image || '';
            defaultValues['is_active'] = selectdData.is_active === 1 ? true : false || '';
            reset(defaultValues);
        }
    }, [selectdData, reset]);

    const { mutate, isPending } = useMutation<any>({
        mutationFn: (data) =>
            axios.post('banners', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const { mutate: mutateUp, isPending: isPendingUp } = useMutation<any>({
        mutationFn: (data) =>
            axios.post(`banners/${selectdData?.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData: any = new FormData();
        formData.append('is_active', formValues['is_active'] === false ? 0 : 1 || '');
        if (formValues.image && typeof formValues.image !== 'string') {
            formData.append('image', formValues.image[0]);
        }

        if (selectdData) {
            formData.append('_method', 'PUT');
            mutateUp(formData, {
                onSuccess: () => {
                    toast.success(t('banners.editSuccess') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-banners'] });
                    setOpen(false);
                    reset();
                    setSelctedData(null);
                },
            });
        } else {
            mutate(formData, {
                onSuccess: () => {
                    toast.success(t('banners.addSuccess') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-banners'] });
                    setOpen(false);
                    reset();
                },
            });
        }
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="font-semibold text-center text-nowrap">{selectdData ? t('banners.editTitle') : t('banners.addTitle')}</h1>
                        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                type="file"
                                rules={{ required: `${t('required')}` }}
                                error={errors?.[`image`]?.message as string}
                                register={register}
                                watch={watch}
                                name="image"
                                label={t('banners.image')}
                            />
                            <Switch name="is_active" control={control} label={t('banners.isActive')} />
                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" disabled={isPending}>
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isPending || isPendingUp}>
                                    {isPending || isPendingUp ? (selectdData ? t('banners.editing') : t('banners.adding')) : selectdData ? t('banners.edit') : t('banners.add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddBanners;
