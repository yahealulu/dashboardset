import { QueryObserverResult, RefetchOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { FC, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next'; // ✅
import Input from '../../components/UI/Input';
import axios from '../../Api/axios';
import Switch from '../../components/UI/Switch';
import { toast } from 'react-toastify';
import SelectForm from '../../components/UI/Select';

const AddState: FC<{
    open: boolean;
    setOpen: (arg: boolean) => void;
    className?: string;
    id: any;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
    setSelctedData: any;
    selectdData: any;
}> = ({ open, setOpen, id, selectdData, setSelctedData }) => {
    const { t } = useTranslation(); // ✅
    const { data } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`/countries`);
            return data;
        },
    });
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
            const defaultValues: any = {
                name: selectdData.name || '',
                country_id: {
                    id: selectdData.country.id,
                    name: selectdData.country.name,
                },
            };
            reset(defaultValues);
        }
    }, [selectdData, reset, data?.data]);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation<any>({
        mutationFn: (data) => axios.post('states', data),
    });
    const { mutate: mutateUp, isPending: isPendingUp } = useMutation<any>({
        mutationFn: (data) => axios.put(`states/${selectdData?.id}`, data),
    });

    const onSubmit: SubmitHandler<any> = (formValues) => {
        if (selectdData) {
            mutateUp(formValues, {
                onSuccess: () => {
                    toast.success(t('state.toast.edited') as string); // ✅
                    queryClient.invalidateQueries({ queryKey: ['get-states'] });
                    setOpen(false);
                    reset();
                    setSelctedData(null);
                },
            });
        } else {
            mutate(formValues, {
                onSuccess: () => {
                    toast.success(t('state.toast.added') as string); // ✅
                    queryClient.invalidateQueries({ queryKey: ['get-states'] });
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
                        <h1 className="font-semibold text-center text-nowrap">{t('state.modal.titleAdd')}</h1>
                        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-4">
                                <Input rules={{ required: t('required') }} error={errors.name?.message} register={register} name="name" label={t('state.name')} />
                                <SelectForm control={control} options={data?.data} name="country_id" label={t('state.country')} />
                            </div>
                            <div className="flex justify-end mt-6">
                                <button type="button" onClick={() => setOpen(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" disabled={isPending}>
                                    {t('common.cancel')}
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isPending || isPendingUp}>
                                    {isPending ? (selectdData ? t('state.modal.editing') : t('state.modal.adding')) : selectdData ? t('state.modal.editBtn') : t('state.modal.addBtn')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddState;
