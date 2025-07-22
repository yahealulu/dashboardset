import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import SelectableProducts from './SelectableProducts';
import Input from '../../components/UI/Input';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AddOffers = () => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        getValues,
        setValue,
        formState: { errors },
    } = useForm();
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: Offers } = useQuery({
        queryKey: ['get-offers-id', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`/offers/${params.id}`);
            return data?.data;
        },
        enabled: !!params.id,
    });

    useEffect(() => {
        if (Offers) {
            reset({
                discount_percentage: Offers.discount_percentage,
                image: Offers.image,
            });

            if (Offers.products && Array.isArray(Offers.products)) {
                setSelectedProducts(Offers.products);
            }
        }
    }, [Offers, reset]);

    const { mutate: Add, isPending: isAdding } = useMutation<any, unknown, FormData>({
        mutationFn: async (formData) => {
            const response = await axios.post(`offers`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });
    const { mutate: update, isPending: isUpdating } = useMutation<FormData, any>({
        mutationFn: (data) =>
            axios.post(`offers/${params.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const onSubmit = () => {
        const payload: any = new FormData();
        if (getValues().image && typeof getValues().image !== 'string') {
            payload.append('image', getValues().image[0]);
        }
        selectedProducts.forEach((sel, i) => {
            payload.append(`variant_ids[${i}]`, sel.id);
        });
        payload.append('discount_percentage', getValues()['discount_percentage'] || '');

        if (params?.id) {
            payload.append('_method', 'PUT');
            update(payload, {
                onSuccess: () => {
                    toast.success(t('offers.edited_success') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-offers'] });
                    navigate('/offers');
                    reset();
                },
            });
        } else {
            Add(payload, {
                onSuccess: () => {
                    toast.success(t('offers.added_success') as string);
                    queryClient.invalidateQueries({ queryKey: ['get-offers'] });
                    navigate('/offers');
                    reset();
                },
            });
        }
    };

    return (
        <div>
            <form>
                <div className="flex gap-4 items-center">
                    <Input register={register} type="number" name="discount_percentage" label={t('offers.discount_percentage')} />
                    <Input watch={watch} type="file" register={register} name="image" label={t('offers.image')} />
                </div>
            </form>

            <SelectableProducts selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />

            <div className="flex justify-end mt-6">
                <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
                    {t('offers.cancel')}
                </button>
                <button onClick={onSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isAdding || isUpdating}>
                    {isAdding || isUpdating ? (params.id ? t('offers.editing') : t('offers.adding')) : params.id ? t('offers.edit') : t('offers.add')}
                </button>
            </div>
        </div>
    );
};

export default AddOffers;
