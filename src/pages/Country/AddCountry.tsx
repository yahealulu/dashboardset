import React from 'react';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/UI/Input';
import SelectForm from '../../components/UI/Select';
import SelectFormMulti from '../../components/UI/MultiReactSlelct';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const optionsType = [
    { name: 'Export', id: 'export' },
    { name: 'Import', id: 'import' },
];

const optionsTrueOrFalse = [
    { name: 'True', id: true },
    { name: 'False', id: false },
];

const SizeArray = [
    { name: '20 Cpm ', id: '20 Cpm ' },
    { name: '40 Cpm ', id: '40 Cpm ' },
    { name: '40 HQ', id: '40 HQ ' },
    { name: '20 Cpm freezed', id: '20 Cpm freezed' },
    { name: '40 Cpm freezed', id: '40 Cpm freezed' },
    { name: '40 HQ freezed', id: '40 HQ freezed' },
];

const formatSizes = (sizes: any[]) => {
    return SizeArray.map((option) => {
        const normalizedOption = option.name.toLowerCase().trim();
        const match = sizes.find((item) => {
            const baseSize = item.size.toLowerCase().trim();
            const isFreezed = item.freezed;

            return isFreezed ? normalizedOption === `${baseSize} freezed` : normalizedOption === baseSize;
        });
        return match ? option.name : null;
    }).filter(Boolean);
};

const parseSizes = (sizes: string[]) => {
    return sizes.map((s) => {
        const isFreezed = s.toLowerCase().includes('freezed');
        const cleanedSize = s.toLowerCase().replace('freezed', '').trim();
        return {
            size: cleanedSize,
            freezed: isFreezed,
        };
    });
};

const AddCountry = () => {
    const params = useParams();
    const { register, handleSubmit, reset, control, watch } = useForm();

    const { errors } = useFormState({ control });
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const { mutate: create, isPending: isCreating } = useMutation({
        mutationFn: (data) => axios.post('countries', data),
    });

    const { data: countriesData } = useQuery({
        queryKey: ['get-countries-id', params.id],
        queryFn: async () => {
            const { data } = await axios.get(`/countries/${params.id}`);
            return data;
        },
        enabled: !!params.id,
    });

    React.useEffect(() => {
        if (countriesData?.data) {
            const values = countriesData.data;
            reset({
                name: values.name || '',
                code: values.code || '',
                type: values.type || '',
                air: String(values.air),
                sea: String(values.sea),
                land: String(values.land),
                sea_allowed_sizes: formatSizes(values.sea_allowed_sizes),
                land_allowed_sizes: formatSizes(values.land_allowed_sizes || []),
                air_allowed_sizes: formatSizes(values.air_allowed_sizes || []),
            });
        }
    }, [countriesData, reset]);

    const { mutate: update, isPending: isUpdating } = useMutation({
        mutationFn: (data) => axios.put(`countries/${params.id}`, data),
    });

    const isSubmitting = isCreating || isUpdating;

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const values = {
            ...formValues,
            air: formValues.air === 'true',
            land: formValues.land === 'true',
            sea: formValues.sea === 'true',
            sea_allowed_sizes: parseSizes(formValues.sea_allowed_sizes || []),
            land_allowed_sizes: parseSizes(formValues.land_allowed_sizes || []),
            air_allowed_sizes: parseSizes(formValues.air_allowed_sizes || []),
        };

        const onSuccess = () => {
            toast.success((params.id ? t('toast.edited') : t('toast.added')) as string);
            queryClient.invalidateQueries({ queryKey: ['get-countries'] });
            navigate(-1);
            reset();
        };

        params.id ? update(values, { onSuccess }) : create(values, { onSuccess });
    };

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl">{params.id ? t('country.titleEdit') : t('country.titleAdd')}</h2>
            </div>

            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 gap-2">
                    <Input register={register} name="name" label={t('form.name')} rules={{ required: t('required') }} error={errors.name?.message} />
                    <Input register={register} name="code" label={t('form.code')} rules={{ required: t('required') }} error={errors.code?.message} />
                    <SelectForm control={control} options={optionsType} name="type" label={t('form.type')} rules={{ required: t('required') }} error={errors.type?.message} />
                    <SelectForm control={control} options={optionsTrueOrFalse} name="air" label={t('form.air')} rules={{ required: t('required') }} error={errors.air?.message} />
                    <SelectForm control={control} options={optionsTrueOrFalse} name="sea" label={t('form.sea')} rules={{ required: t('required') }} error={errors.sea?.message} />
                    <SelectForm control={control} options={optionsTrueOrFalse} name="land" label={t('form.land')} rules={{ required: t('required') }} error={errors.land?.message} />
                    <SelectFormMulti
                        control={control}
                        multi
                        options={SizeArray}
                        name="sea_allowed_sizes"
                        label={t('form.seaAllowed')}
                        rules={{ required: t('required') }}
                        error={errors.sea_allowed_sizes?.message}
                    />
                    <SelectFormMulti
                        control={control}
                        multi
                        options={SizeArray}
                        name="land_allowed_sizes"
                        label={t('form.landAllowed')}
                        rules={{ required: t('required') }}
                        error={errors.land_allowed_sizes?.message}
                    />
                    <SelectFormMulti
                        control={control}
                        multi
                        options={SizeArray}
                        name="air_allowed_sizes"
                        label={t('form.airAllowed')}
                        rules={{ required: t('required') }}
                        error={errors.air_allowed_sizes?.message}
                    />
                </div>

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={() => navigate(-1)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400" disabled={isSubmitting}>
                        {t('actions.cancel')}
                    </button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" disabled={isSubmitting}>
                        {isSubmitting ? (params.id ? t('actions.editing') : t('actions.adding')) : params.id ? t('actions.edit') : t('actions.add')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCountry;
