import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axios from '../../Api/axios';

import ImageGalleryInput from '../../components/UI/ImageGalleryInput';
import TextArea from '../../components/UI/TextArea';

interface AboutUsData {
    id: number;
    description_translations: Record<string, string>;
    gallery: (File | string)[];
    video_url: string[];
}

interface FormValues {
    [key: `description_translations_${string}`]: string;
    video_url: string[];
    gallery: (File | string)[];
}

const languages = ['ar', 'en', 'fr', 'de', 'tr', 'fa', 'ru', 'da'] as const;

const AddAboutUs: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();
    const [allFiles, setAllFiles] = useState<any>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);

    const { data, isLoading } = useQuery<{ data: AboutUsData }>({
        queryKey: ['get-about-us-id', id],
        queryFn: async () => {
            const response = await axios.get(`/about-us/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const { mutate: addAboutUs, isPending: isAdding } = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axios.post('about-us', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });

    const { mutate: updateAboutUs, isPending: isUpdating } = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await axios.post(`about-us/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        },
    });

    useEffect(() => {
        if (data?.data) {
            const defaultValues: Partial<FormValues> = {};
            languages.forEach((lang) => {
                defaultValues[`description_translations_${lang}`] = data.data.description_translations?.[lang] || '';
            });
            reset(defaultValues);
            setVideoUrls(data.data.video_url || []);
            setAllFiles(data.data.gallery || []);
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData = new FormData();
        languages.forEach((lang) => {
            formData.append(`description_translations[${lang}]`, formValues[`description_translations_${lang}`] || '');
        });

        allFiles.forEach((file: any, i: number) => {
            if (typeof file !== 'string') {
                formData.append(`gallery[${i}]`, file);
            }
        });

        videoUrls.forEach((url, i) => {
            formData.append(`video_url[${i}]`, url);
        });

        if (id) {
            formData.append('_method', 'PUT');
            updateAboutUs(formData, {
                onSuccess: () => {
                    toast.success(t('aboutUs.editedSuccess') as string);
                    queryClient.invalidateQueries({ queryKey: ['about-us'] });
                    navigate(-1);
                    reset();
                },
            });
        } else {
            addAboutUs(formData, {
                onSuccess: () => {
                    toast.success(t('aboutUs.addedSuccess') as string);
                    queryClient.invalidateQueries({ queryKey: ['about-us'] });
                    navigate(-1);
                    reset();
                },
            });
        }
    };

    const handleAddVideoUrl = (e: React.FocusEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        if (url) {
            setVideoUrls((prev) => [...prev, url]);
            e.target.value = '';
        }
    };

    const handleRemoveVideoUrl = (index: number) => {
        setVideoUrls((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <h2 className="text-xl font-semibold">{id ? t('aboutUs.editTitle') : t('aboutUs.addTitle')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-4">
                    {languages.map((lang) => (
                        <TextArea
                            key={lang}
                            control={control}
                            name={`description_translations_${lang}`}
                            label={t('aboutUs.description', { lang: lang.toUpperCase() })}
                            rules={{ required: `${t('required')} (${lang.toUpperCase()})` }}
                            error={errors?.[`description_translations_${lang}`]?.message as string}
                        />
                    ))}

                    <div className="col-span-4">
                        <label className="block text-sm font-semibold mb-1">{t('aboutUs.addVideoUrl')}</label>
                        <input type="url" placeholder={t('aboutUs.enterVideoUrl')} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" onBlur={handleAddVideoUrl} />
                        {videoUrls.length > 0 && (
                            <div className="mt-2 flex flex-col gap-2">
                                {videoUrls.map((url, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span className="break-all">{url}</span>
                                        <button type="button" onClick={() => handleRemoveVideoUrl(index)} className="text-red-500 hover:underline ml-2">
                                            {t('common.remove')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-span-4">
                        <ImageGalleryInput allFiles={allFiles} setAllFiles={setAllFiles} name="gallery" label={t('aboutUs.galleryLabel')} register={register} watch={watch} />
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                        {t('common.cancel')}
                    </button>
                    <button disabled={isAdding || isUpdating} type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        {isAdding || isUpdating ? (id ? t('aboutUs.editing') : t('aboutUs.adding')) : id ? t('common.edit') : t('common.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAboutUs;
