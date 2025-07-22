import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/UI/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextArea from '../../components/UI/TextArea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AddRating = () => {
    const { t } = useTranslation();
    const params = useParams();
    const { register, handleSubmit, control, reset } = useForm();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: Add, isPending: isAdding } = useMutation<any, unknown, FormData>({
        mutationFn: async (formData) => {
            const response = await axios.post(`ratings`, formData);
            return response.data;
        },
    });

    const onSubmit: SubmitHandler<any> = (formData: any) => {
        const Values = {
            ...formData,
            rateable_id: Number(params.rateable_id),
            rateable_type: params.type,
        };
        Add(Values, {
            onSuccess: () => {
                toast.success(t('rating.addedSuccess') as string);
                queryClient.invalidateQueries({ queryKey: ['get-ratings'] });
                navigate(-1);
                reset();
            },
        });
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl">
                    {params.id ? t('rating.editTitle') : t('rating.addTitle')}
                </h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-start gap-8">
                    <Input register={register} name="rating" label={t('rating.rating')} />
                    <TextArea control={control} name="comment" label={t('rating.comment')} />
                </div>
                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        disabled={isAdding}
                    >
                        {isAdding
                            ? params.id
                                ? t('common.editing')
                                : t('common.adding')
                            : params.id
                            ? t('common.edit')
                            : t('common.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRating;
