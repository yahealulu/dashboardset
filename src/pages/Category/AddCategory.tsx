import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/UI/Input';
import axios from '../../Api/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SelectForm from '../../components/UI/Select';
import { useTranslation } from 'react-i18next';

const languages = ['ar', 'en', 'fr', 'de', 'tr', 'fa', 'ru', 'da'];

const AddCategory = () => {
    const { t } = useTranslation();
    const params = useParams();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: CategoryData } = useQuery({
        queryKey: ['get-category-id', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`/categories/${params.id}`);
            return data;
        },
        enabled: !!params.id,
    });

    useEffect(() => {
        if (CategoryData?.data) {
            const defaultValues: any = {};
            languages.forEach((lang) => {
                defaultValues[`name_translations_${lang}`] = CategoryData.data.name_translations?.[lang] || '';
            });
            defaultValues['country_origin_id'] = CategoryData.data.country_origin_id || '';
            defaultValues['image'] = CategoryData.data.image || '';
            reset(defaultValues);
        }
    }, [CategoryData, reset]);

    const { data } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`/countries?type=export`);
            return data;
        },
    });

    const { mutate: create, isPending: isCreating } = useMutation<any>({
        mutationFn: (data) =>
            axios.post('categories', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const { mutate: update, isPending: isUpdating } = useMutation<FormData, any>({
        mutationFn: (data) =>
            axios.post(`categories/${params.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData: any = new FormData();
        languages.forEach((lang) => {
            formData.append(`name_translations[${lang}]`, formValues[`name_translations_${lang}`] || '');
        });
        if (formValues.image && typeof formValues.image !== 'string') {
            formData.append('image', formValues.image[0]);
        }
        formData.append('country_origin_id', formValues.country_origin_id);

        if (params.id) {
            formData.append('_method', 'PUT');
            update(formData, {
                onSuccess: () => {
                    toast.success(t('category.editSuccess') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-categories'] });
                    navigate(-1);
                    reset();
                },
            });
        } else {
            create(formData, {
                onSuccess: () => {
                    toast.success(t('category.addSuccess') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-categories'] });
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
                <h2 className="text-xl">{params.id ? t('category.editTitle') : t('category.addTitle')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-2">
                    {languages.map((lang) => (
                        <Input
                            key={`name_${lang}`}
                            register={register}
                            name={`name_translations_${lang}`}
                            label={t(`category.name`, { lang: lang.toUpperCase() })}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`name_translations_${lang}`]?.message as string}
                        />
                    ))}
                    <SelectForm control={control} options={data?.data} name="country_origin_id" label={t('category.country')} />
                    <Input
                        rules={{ required: `${t('required')}` }}
                        error={errors?.[`image`]?.message as string}
                        type="file"
                        watch={watch}
                        register={register}
                        name="image"
                        label={t('category.image')}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" disabled={isSubmitting}>
                        {t('common.cancel')}
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isSubmitting}>
                        {isSubmitting ? (params.id ? t('category.editing') : t('category.adding')) : params.id ? t('category.edit') : t('category.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
