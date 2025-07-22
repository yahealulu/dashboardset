import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Input from '../../components/UI/Input';
import TextArea from '../../components/UI/TextArea';
import { useNavigate, useParams } from 'react-router-dom';
import ImageGalleryInput from '../../components/UI/ImageGalleryInput';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const languages = ['ar', 'en', 'fr', 'de', 'tr', 'fa', 'ru', 'da'];

const AddBites = () => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();
    const params = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [allFiles, setAllFiles] = useState<File[]>([]);
    const watchedImage = watch('image');

    const { data } = useQuery({
        queryKey: ['get-bites-id', params.id],
        queryFn: async () => {
            const response = await axios.get(`/bites/${params.id}`);
            return response.data;
        },
        enabled: !!params.id,
    });

    useEffect(() => {
        if (data?.data) {
            const defaultValues: any = {};

            languages.forEach((lang) => {
                defaultValues[`name_translations_${lang}`] = data.data.name_translations?.[lang] || '';
                defaultValues[`preparation_translations_${lang}`] = data.data.preparation_translations?.[lang] || '';
                defaultValues[`ingredients_translations_${lang}`] = data.data.ingredients_translations?.[lang] || '';
                defaultValues[`description_translations_${lang}`] = data.data.description_translations?.[lang] || '';
            });

            defaultValues['video_url'] = data.data.video_url || '';
            defaultValues['image'] = data.data.image || '';

            setAllFiles(data.data.gallery || []);
            reset(defaultValues);
        }
    }, [data, reset]);

    const { mutate: addBite, isPending: isAdding } = useMutation<any, unknown, FormData>({
        mutationFn: async (formData) => {
            const response = await axios.post(`bites`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });

    const { mutate: updateBite, isPending: isUpdating } = useMutation<any, unknown, FormData>({
        mutationFn: async (formData) => {
            const response = await axios.post(`bites/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });

    const onSubmit: SubmitHandler<any> = (formData) => {
        const payload = new FormData();

        languages.forEach((lang) => {
            payload.append(`name_translations[${lang}]`, formData?.[`name_translations_${lang}`] || '');
            payload.append(`preparation_translations[${lang}]`, formData?.[`preparation_translations_${lang}`] || '');
            payload.append(`ingredients_translations[${lang}]`, formData?.[`ingredients_translations_${lang}`] || '');
            payload.append(`description_translations[${lang}]`, formData?.[`description_translations_${lang}`] || '');
        });

        payload.append('video_url', formData['video_url'] || '');
        if (formData.image && typeof formData.image !== 'string') {
            payload.append('image', formData.image[0]);
        }

        allFiles?.forEach((file) => {
            if (typeof file !== 'string') {
                payload.append('gallery', file);
            }
        });

        if (params.id) {
            payload.append('_method', 'PUT');
            updateBite(payload, {
                onSuccess: () => {
                    toast.success(t('bitesForm.toasts.edited') as string);
                    navigate(-1);
                    queryClient.refetchQueries({ queryKey: ['get-bites'] });
                    reset();
                },
            });
        } else {
            addBite(payload, {
                onSuccess: () => {
                    toast.success(t('bitesForm.toasts.added') as string);
                    navigate(-1);
                    queryClient.refetchQueries({ queryKey: ['get-bites'] });
                    reset();
                },
            });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl">{params.id ? t('bitesForm.title.edit') : t('bitesForm.title.add')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-2">
                    {languages.map((lang) => (
                        <Input
                            key={`name_${lang}`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            register={register}
                            name={`name_translations_${lang}`}
                            label={`${t('required')} (${lang.toUpperCase()})`}
                            error={errors?.[`name_translations_${lang}`]?.message as string}
                        />
                    ))}

                    {languages.map((lang) => (
                        <TextArea
                            key={`preparation_${lang}`}
                            control={control}
                            name={`preparation_translations_${lang}`}
                            label={`${t('bitesForm.fields.preparation')} (${lang.toUpperCase()})`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`preparation_translations_${lang}`]?.message as string}
                        />
                    ))}

                    {languages.map((lang) => (
                        <TextArea
                            key={`ingredients_${lang}`}
                            control={control}
                            name={`ingredients_translations_${lang}`}
                            label={`${t('bitesForm.fields.ingredients')} (${lang.toUpperCase()})`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`ingredients_translations_${lang}`]?.message as string}
                        />
                    ))}

                    {languages.map((lang) => (
                        <TextArea
                            key={`description_${lang}`}
                            control={control}
                            name={`description_translations_${lang}`}
                            label={`${t('bitesForm.fields.description')} (${lang.toUpperCase()})`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`ingredients_translations_${lang}`]?.message as string}
                        />
                    ))}

                    <Input register={register} name="video_url" label={t('bitesForm.fields.videoUrl')} error={errors?.video_url?.message as string} />

                    <Input
                        watch={watch}
                        rules={{ required: `${t('required')}` }}
                        error={errors?.[`image`]?.message as string}
                        type="file"
                        register={register}
                        name="image"
                        label={t('bitesForm.fields.image')}
                    />

                    <ImageGalleryInput allFiles={allFiles} setAllFiles={setAllFiles} name="gallery" label={t('bitesForm.fields.gallery')} register={register} watch={watch} />
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400">
                        {t('bitesForm.buttons.cancel')}
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isAdding || isUpdating}>
                        {isAdding || isUpdating ? (params.id ? t('bitesForm.buttons.editing') : t('bitesForm.buttons.adding')) : params.id ? t('bitesForm.buttons.edit') : t('bitesForm.buttons.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBites;
