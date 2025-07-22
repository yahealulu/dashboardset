import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../Api/axios';
import ImageGalleryInput from '../../components/UI/ImageGalleryInput';
import Input from '../../components/UI/Input';
import TextArea from '../../components/UI/TextArea';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const languages = ['ar', 'en', 'fr', 'de', 'tr', 'fa', 'ru', 'da'];

const AddActivities = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const navigate = useNavigate();
    const params = useParams();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const watchedImage = watch('image');
    const imageFile = watchedImage && watchedImage[0];

    const { mutate: createActivity, isPending: isCreating } = useMutation<any>({
        mutationFn: (data) =>
            axios.post('activities', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const { mutate: updateActivity, isPending: isUpdating } = useMutation<FormData, any>({
        mutationFn: (data) =>
            axios.post(`activities/${params.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const { data: activityData } = useQuery({
        queryKey: ['get-activities-id', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`/activities/${params.id}`);
            return data;
        },
        enabled: !!params.id,
    });

    useEffect(() => {
        if (activityData?.data) {
            const defaultValues: any = {};

            languages.forEach((lang) => {
                defaultValues[`name_translations_${lang}`] = activityData.data.name_translations?.[lang] || '';
                defaultValues[`location_translations_${lang}`] = activityData.data.location_translations?.[lang] || '';
                defaultValues[`description_translations_${lang}`] = activityData.data.description_translations?.[lang] || '';
            });

            defaultValues['type'] = activityData.data.type || '';
            defaultValues['event_date'] = activityData.data.event_date || '';
            defaultValues['image'] = activityData.data.images || '';

            setAllFiles(activityData.data.gallery || []);
            reset(defaultValues);
        }
    }, [activityData, reset]);

    const createFormData = (formValues: any) => {
        const formData: any = new FormData();

        languages.forEach((lang) => {
            formData.append(`name_translations[${lang}]`, formValues[`name_translations_${lang}`] || '');
            formData.append(`location_translations[${lang}]`, formValues[`location_translations_${lang}`] || '');
            formData.append(`description_translations[${lang}]`, formValues[`description_translations_${lang}`] || '');
        });

        formData.append('video_url', formValues['video_url'] || '');
        formData.append('type', formValues['type'] || '');
        formData.append('event_date', formValues['event_date'] || '');

        if (formValues.image && typeof formValues.image != 'string') {
            formData.append('images', formValues.image[0]);
        }

        allFiles.forEach((file) => {
            if (typeof file !== 'string') {
                formData.append('gallery', file);
            }
        });

        return formData;
    };

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData = createFormData(formValues);

        if (params.id) {
            formData.append('_method', 'PUT');
            updateActivity(formData, {
                onSuccess: () => {
                    toast.success(t('activities.successEdit') as string);
                    queryClient.invalidateQueries({ queryKey: ['activities'] });
                    navigate(-1);
                    reset();
                },
            });
        } else {
            createActivity(formData, {
                onSuccess: () => {
                    toast.success(t('activities.successAdd') as string);
                    queryClient.invalidateQueries({ queryKey: ['activities'] });
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
                <h2 className="text-xl">{params.id ? t('activities.editActivity') : t('activities.addActivity')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-2">
                    {languages.map((lang) => (
                        <Input
                            key={`name_${lang}`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`name_translations_${lang}`]?.message as string}
                            register={register}
                            name={`name_translations_${lang}`}
                            label={`${t('activities.name')} (${lang.toUpperCase()})`}
                        />
                    ))}

                    {languages.map((lang) => (
                        <TextArea
                            key={`description_${lang}`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`description_translations_${lang}`]?.message as string}
                            control={control}
                            name={`description_translations_${lang}`}
                            label={`${t('activities.description')} (${lang.toUpperCase()})`}
                        />
                    ))}

                    {languages.map((lang) => (
                        <TextArea
                            key={`location_${lang}`}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`location_translations_${lang}`]?.message as string}
                            control={control}
                            name={`location_translations_${lang}`}
                            label={`${t('activities.location')} (${lang.toUpperCase()})`}
                        />
                    ))}

                    <Input register={register} name="type" label={t('activities.type')} />
                    <Input register={register} name="event_date" label={t('activities.eventDate')} type="date" />
                    <Input
                        type="file"
                        rules={{ required: `${t('required')}` }}
                        error={errors?.[`image`]?.message as string}
                        watch={watch}
                        register={register}
                        name="image"
                        label={t('activities.image')}
                    />

                    <ImageGalleryInput allFiles={allFiles} setAllFiles={setAllFiles} name="gallery" label={t('activities.galleryImages')} register={register} watch={watch} />
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" disabled={isSubmitting}>
                        {t('activities.cancel')}
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isSubmitting}>
                        {isSubmitting ? (params.id ? t('activities.editing') : t('activities.adding')) : params.id ? t('activities.edit') : t('activities.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddActivities;
