import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/UI/Input';
import TextArea from '../../components/UI/TextArea';
import axios from '../../Api/axios';
import Switch from '../../components/UI/Switch';
import SelectForm from '../../components/UI/Select';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const languages = ['ar', 'en', 'fr', 'de', 'tr', 'fa', 'ru', 'da'];
const Matrial = [
    { name: 'Dried', id: 'dried' },
    { name: 'Frozen', id: 'frozen' },
    { name: 'MiX', id: 'miX' },
    { name: 'Concert', id: 'Concert' },
];

const AddProducts = () => {
    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            in_stock: false,
            is_hidden: false,
            is_new: false,
        },
    });

    const { data: ProductsData } = useQuery({
        queryKey: ['get-products-id', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`/products/${params.id}`);
            return data?.data;
        },
        enabled: !!params.id,
    });

    useEffect(() => {
        if (ProductsData) {
            const defaultValues: any = {
                product_code: ProductsData.product_code,
                barcode: ProductsData.barcode,
                weight_unit: ProductsData.weight_unit,
                product_category: ProductsData.product_category,
                material_property: ProductsData.material_property,
                category_id: ProductsData.category_id,
                country_origin_id: ProductsData.country_origin_id?.id,
                in_stock: !!ProductsData.in_stock,
                is_hidden: !!ProductsData.is_hidden,
                is_new: !!ProductsData.is_new,
            };

            languages.forEach((lang) => {
                defaultValues[`name_translations_${lang}`] = ProductsData.name_translations?.[lang] || '';
                defaultValues[`description_translations_${lang}`] = ProductsData.description_translations?.[lang] || '';
            });

            reset(defaultValues);
        }
    }, [ProductsData, reset]);

    const { mutate: Addproduct, isPending: isAdding } = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axios.post(`products`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axios.post(`products/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });

    const { data: Categories } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const { data } = await axios.get(`/categories`);
            return data;
        },
    });

    const { data: Countries } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`/countries?type=export`);
            return data;
        },
    });

    const Categoriesss = Categories?.data.map((d: any) => ({
        id: d.id,
        name: d.name_translations.en,
    }));

    const onSubmit: SubmitHandler<any> = (formData) => {
        const payload = new FormData();

        languages.forEach((lang) => {
            payload.append(`name_translations[${lang}]`, formData?.[`name_translations_${lang}`] || '');
            payload.append(`description_translations[${lang}]`, formData?.[`description_translations_${lang}`] || '');
        });

        payload.append('barcode', formData['barcode'] || '');
        payload.append('product_code', formData['product_code'] || '');
        payload.append('weight_unit', formData['weight_unit'] || '');
        payload.append('category_id', formData['category_id'] || '');
        payload.append('country_origin_id', formData['country_origin_id'] || '');
        payload.append('material_property', formData['material_property'] || '');
        payload.append('in_stock', formData['in_stock'] ? '1' : '0');
        payload.append('is_hidden', formData['is_hidden'] ? '1' : '0');
        payload.append('is_new', formData['is_new'] ? '1' : '0');
        payload.append('product_category', formData['product_category'] || '');

        if (formData.image && typeof formData.image !== 'string') {
            payload.append('image', formData.image[0]);
        }
        if (formData.variant_image && typeof formData.variant_image !== 'string') {
            payload.append('variant_image', formData.variant_image[0]);
        }

        if (ProductsData) {
            payload.append('_method', 'PUT');
            update(payload, {
                onSuccess: () => {
                    toast.success(t('products.edited_successfully') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-products'] });
                    navigate(-1);
                    reset();
                },
            });
        } else {
            Addproduct(payload, {
                onSuccess: () => {
                    toast.success(t('products.added_successfully') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-products'] });
                    navigate(-1);
                    reset();
                },
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl">{params.id ? t('products.edit_title') : t('products.add_title')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-2">
                    <Input rules={{ required: t('required') }} error={errors.product_code?.message} register={register} name="product_code" label={t('products.product_code')} />
                    {languages.map((lang) => (
                        <Input
                            key={`name_${lang}`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`name_translations_${lang}`]?.message as string}
                            register={register}
                            name={`name_translations_${lang}`}
                            label={`${t('products.name')} (${lang.toUpperCase()})`}
                        />
                    ))}
                    {languages.map((lang) => (
                        <TextArea
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`description_translations_${lang}`]?.message as string}
                            key={`description_${lang}`}
                            control={control}
                            name={`description_translations_${lang}`}
                            label={`${t('products.description')} (${lang.toUpperCase()})`}
                        />
                    ))}
                    <SelectForm rules={{ required: t('required') }} error={errors.category_id?.message} control={control} options={Categoriesss} name="category_id" label={t('products.category')} />
                    <SelectForm control={control} options={Countries?.data} name="country_origin_id" label={t('products.country')} />
                    <SelectForm control={control} options={Matrial} name="material_property" label={t('products.material_property')} />
                    <Input register={register} name="weight_unit" label={t('products.weight_unit')} />
                    <Input register={register} name="barcode" label={t('products.barcode')} />
                    <Input register={register} name="product_category" label={t('products.product_category')} />
                    <div className="flex gap-4">
                        <Switch name="in_stock" control={control} label={t('products.in_stock')} />
                        <Switch name="is_hidden" control={control} label={t('products.is_hidden')} />
                        <Switch name="is_new" control={control} label={t('products.is_new')} />
                    </div>
                    <Input
                        watch={watch}
                        type="file"
                        rules={{ required: `${t('required')}` }}
                        error={errors?.[`image`]?.message as string}
                        register={register}
                        name="image"
                        label={t('products.image')}
                    />
                    <Input
                        watch={watch}
                        type="file"
                        rules={{ required: `${t('required')}` }}
                        error={errors?.[`variant_image`]?.message as string}
                        register={register}
                        name="variant_image"
                        label={t('products.variant_image')}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
                        {t('common.cancel')}
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isAdding || isUpdating}>
                        {isAdding || isUpdating ? (params.id ? t('products.editing') : t('products.adding')) : params.id ? t('products.edit') : t('products.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProducts;
