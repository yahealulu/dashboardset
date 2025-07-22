import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../components/UI/Input';
import Switch from '../../../components/UI/Switch';
import SelectForm from '../../../components/UI/Select';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../../Api/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Packaging = [
  { name: 'Wood', id: 'wood' },
  { name: 'Plastic', id: 'plastic' },
  { name: 'Glass', id: 'glass' },
  { name: 'Cartoon', id: 'cartoon' },
  { name: 'Canned', id: 'canned' },
  { name: 'Vacuum', id: 'vacuum' },
  { name: 'Bag', id: 'bag' },
];

const AddItem = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, reset, control } = useForm<any>({
    defaultValues: {
      in_stock: false,
      is_hidden: false,
      is_new: false,
    },
  });

  const { data: itemData } = useQuery({
    queryKey: ['get-item-id', params.id],
    queryFn: async () => {
      const { data } = await axios.get(`products/${params.id}/variants/${params.itemId}`);
      return data?.data;
    },
    enabled: !!params.itemId,
  });

  useEffect(() => {
    if (itemData) {
      const defaultValues: any = { ...itemData };
      reset(defaultValues);
    }
  }, [itemData, params?.itemId]);

  const queryClient = useQueryClient();

  const { mutate: update, isPending: isUpdating } = useMutation<any, unknown, FormData>({
    mutationFn: async (formData) => {
      const response = await axios.post(`products/${params.id}/variants/${params.itemId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  });

  const { mutate: Add, isPending: isAdding } = useMutation<any, unknown, FormData>({
    mutationFn: async (formData) => {
      const response = await axios.post(`products/${params.id}/variants`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    },
  });

  const onSubmit: SubmitHandler<any> = (formData: any) => {
    const payload: any = new FormData();
    payload.append('size', formData['size'] || '');
    payload.append('gross_weight', formData['gross_weight'] || '');
    payload.append('net_weight', formData['net_weight'] || '');
    payload.append('tare_weight', formData['tare_weight'] || '');
    payload.append('free_quantity', formData['free_quantity'] || '');
    payload.append('standard_weight', formData['standard_weight'] || '');
    payload.append('packaging', formData['packaging'] || '');
    payload.append('box_dimensions', formData['box_dimensions'] || '');
    payload.append('box_packing', formData['box_packing'] || '');

    payload.append('in_stock', formData['in_stock'] === false ? 0 : 1 || '');
    payload.append('is_hidden', formData['is_hidden'] === false ? 0 : 1 || '');
    payload.append('is_new', formData['is_new'] === false ? 0 : 1 || '');
    payload.append('product_category', formData['product_category']);

    if (formData.image && typeof formData.image != 'string') {
      payload.append('image', formData.image[0]);
    }

    if (params.itemId) {
      payload.append('_method', 'PUT');
      update(payload, {
        onSuccess: () => {
          toast.success(t('editSuccess') as string);
          queryClient.invalidateQueries({ queryKey: ['get-variants'] });
          navigate(-1);
          reset();
        },
      });
    } else {
      Add(payload, {
        onSuccess: () => {
          toast.success(t('addSuccess') as string);
          queryClient.invalidateQueries({ queryKey: ['get-variants'] });
          navigate(-1);
          reset();
        },
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl">
          {params.itemId ? t('editItem') : t('addItem')}
        </h2>
      </div>

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 gap-2">
          <Input register={register} name="size" label={t('size')} />
          <Input register={register} name="gross_weight" label={t('grossWeight')} />
          <Input register={register} name="net_weight" label={t('netWeight')} />
          <Input register={register} name="tare_weight" label={t('tareWeight')} />
          <Input register={register} name="standard_weight" label={t('standardWeight')} />
          <Input register={register} name="free_quantity" label={t('freeQuantity')} />
          <Input register={register} name="box_dimensions" label={t('boxDimensions')} />
          <Input register={register} name="box_packing" label={t('boxPacking')} />
          <SelectForm control={control} options={Packaging} name="packaging" label={t('packaging')} />
          <div className="flex gap-4">
            <Switch name="in_stock" control={control} label={t('inStock')} />
            <Switch name="is_hidden" control={control} label={t('isHidden')} />
            <Switch name="is_new" control={control} label={t('isNew')} />
          </div>
          <Input watch={watch} type="file" register={register} name="image" label={t('image')} />
        </div>
        <div className="flex justify-end mt-6">
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
            {t('cancel')}
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isAdding || isUpdating}>
            {isAdding || isUpdating ? (params.itemId ? t('editing') : t('adding')) : params.itemId ? t('edit') : t('add')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
