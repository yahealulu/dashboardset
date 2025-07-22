import React, { useEffect, useState } from 'react';
import PermissionsPage from './PermissionsPage';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Input from '../../components/UI/Input';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import SelectForm from '../../components/UI/Select';
import { useTranslation } from 'react-i18next';

const AddAdmins = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const params = useParams();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const { data: usersData } = useQuery({
        queryKey: ['get-users-id', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`/users/${params.id}`);
            return data.data;
        },
        enabled: !!params.id,
    });

    const { mutate: update, isPending: isUpdating } = useMutation<FormData, any>({
        mutationFn: (data) => axios.put(`users/${params.id}`, data),
    });

    useEffect(() => {
        if (usersData) {
            reset({
                name: usersData.name || '',
                email: usersData.email || '',
                phone: usersData.phone || '',
                port: usersData.port || '',
                company_name: usersData.company_name || '',
                address: usersData.address || '',
                country_id: usersData.country_id?.toString() || '',
                password: '',
            });

            if (usersData.permissions && Array.isArray(usersData.permissions)) {
                setSelected(usersData.permissions);
            }
        }
    }, [usersData, params.id, reset]);

    const { mutate: create, isPending: isCreating } = useMutation<any>({
        mutationFn: (data) => axios.post('register', data),
    });

    const { data: Countries } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`/countries?type=import`);
            return data;
        },
    });

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const values = {
            ...formValues,
            country_id: Number(formValues.country_id),
            role: 'superadmin',
            permissions: selected.map((p) => p),
        };
        if (params.id) {
            update(values, {
                onSuccess: () => {
                    toast.success(t('addAdmin.successEdit') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-superAdmin'] });
                    navigate(-1);
                    reset();
                },
            });
        } else {
            create(values, {
                onSuccess: () => {
                    toast.success(t('addAdmin.successAdd') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-superAdmin'] });
                    navigate(-1);
                    reset();
                },
            });
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl">{params.id ? t('addAdmin.editTitle') : t('addAdmin.addTitle')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-3 gap-4">
                    <Input rules={{ required: t('required') }} error={errors.name?.message} register={register} name="name" label={t('addAdmin.name')} />
                    <Input register={register} name="email" label={t('addAdmin.email')}  rules={{ required: t('required') }} error={errors.email?.message} />
                    <Input register={register} name="phone" label={t('addAdmin.phone')}  rules={{ required: t('required') }} error={errors.phone?.message}/>
                    <Input register={register} name="port" label={t('addAdmin.port')} />
                    <Input register={register} name="company_name" label={t('addAdmin.companyName')} />
                    <SelectForm control={control} options={Countries?.data} name="country_id" label={t('addAdmin.country')} />
                    <Input register={register} name="address" label={t('addAdmin.address')} />
                    <Input register={register} type="password" name="password" label={t('addAdmin.password')} />
                </div>

                <PermissionsPage selected={selected} setSelected={setSelected} />

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" disabled={isSubmitting}>
                        {t('addAdmin.cancel')}
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isSubmitting}>
                        {isSubmitting ? (params.id ? t('addAdmin.editing') : t('addAdmin.adding')) : params.id ? t('addAdmin.edit') : t('addAdmin.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAdmins;
