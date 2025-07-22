import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/UI/Input';
import axios, { imgUrl } from '../../Api/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SelectForm from '../../components/UI/Select';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../components/UI/Loader';

// Define the languages array for translations
const languages = ['ar', 'en', 'fr', 'dk', 'ir', 'ru', 'cn', 'de', 'tur', 'tr', 'fa', 'da'];

// Define which languages are required
const requiredLanguages = ['ar', 'en'];

const EditCategory = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm();

    // Fetch category data by ID
    const { data: categoryData, isLoading } = useQuery({
        queryKey: ['get-category-id', id],
        queryFn: async () => {
            const { data } = await axios.get(`/categories/${id}`);
            return data;
        },
        enabled: !!id,
    });

    // Fetch countries for the dropdown
    const { data: countriesData } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`/countries?type=export`);
            return data;
        },
    });

    // Set form default values when category data is loaded
    useEffect(() => {
        if (categoryData?.data) {
            const defaultValues: any = {};
            
            // Set name translations
            languages.forEach((lang) => {
                defaultValues[`name_translations_${lang}`] = categoryData.data.name_translations?.[lang] || '';
            });
            
            // Set country origin
            defaultValues['country_origin_id'] = categoryData.data.country_origin_id || '';
            
            // Set image and preview
            defaultValues['image'] = '';
            if (categoryData.data.image) {
                setImagePreview(`${imgUrl}${categoryData.data.image}`);
            }
            
            // Set hidden status
            defaultValues['is_hidden'] = categoryData.data.is_hidden || false;
            
            reset(defaultValues);
        }
    }, [categoryData, reset]);

    // Update mutation
    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: (formData: FormData) =>
            axios.post(`categories/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
        onSuccess: () => {
            toast.success(t('category.editSuccess') as string);
            queryClient.invalidateQueries({ queryKey: ['get-categories'] });
            navigate('/company-industry/category'); // Navigate back to category list
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || t('common.errorOccurred'));
        },
    });

    // Form submission handler
    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData = new FormData();
        
        // Append name translations
        languages.forEach((lang) => {
            formData.append(`name_translations[${lang}]`, formValues[`name_translations_${lang}`] || '');
        });
        
        // Append new image if selected
        if (formValues.image && formValues.image[0]) {
            formData.append('image', formValues.image[0]);
        }
        
        // Append country origin
        if (formValues.country_origin_id) {
            formData.append('country_origin_id', formValues.country_origin_id);
        }
        
        // Append hidden status
        formData.append('is_hidden', formValues.is_hidden ? '1' : '0');
        
        // Append method for Laravel to handle as PUT request
        formData.append('_method', 'PUT');
        
        // Submit the form
        update(formData);
    };

    // Handle image change preview
    const watchImage = watch('image');
    useEffect(() => {
        if (watchImage && watchImage[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(watchImage[0]);
        }
    }, [watchImage]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                <h2 className="text-xl font-semibold">{t('category.editTitle')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Name translations */}
                    {languages.map((lang) => (
                        <Input
                            key={`name_${lang}`}
                            register={register}
                            name={`name_translations_${lang}`}
                            label={t(`category.name`, { lang: lang.toUpperCase() })}
                            rules={{
                                required: requiredLanguages.includes(lang) ? `${t('required')} (${lang.toUpperCase()})` : false,
                            }}
                            error={errors?.[`name_translations_${lang}`]?.message as string}
                        />
                    ))}
                    
                    {/* Country selection */}
                    <SelectForm 
                        control={control} 
                        options={countriesData?.data} 
                        name="country_origin_id" 
                        label={t('category.country')} 
                    />
                    
                    {/* Image upload */}
                    <div className="col-span-1">
                        <Input
                            type="file"
                            register={register}
                            name="image"
                            label={t('category.image')}
                            accept="image/*"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <p className="text-sm mb-1">{t('category.currentImage')}:</p>
                                <img 
                                    src={imagePreview} 
                                    alt="Category" 
                                    className="w-20 h-20 object-cover rounded-md" 
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Hidden status */}
                    <div className="col-span-1 flex items-center mt-8">
                        <input
                            type="checkbox"
                            id="is_hidden"
                            {...register('is_hidden')}
                            className="mr-2"
                        />
                        <label htmlFor="is_hidden">{t('category.isHidden')}</label>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button 
                        type="button" 
                        onClick={() => navigate('/company-industry/category')} 
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" 
                        disabled={isUpdating}
                    >
                        {t('common.cancel')}
                    </button>
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" 
                        disabled={isUpdating}
                    >
                        {isUpdating ? t('category.editing') : t('category.edit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;