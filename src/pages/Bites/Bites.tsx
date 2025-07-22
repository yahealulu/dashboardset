import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios, { imgUrl } from '../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import DialougRemove from '../../components/UI/DialougRemove';
import { Loader } from '../../components/UI/Loader';
import IconEdit from '../../components/Icon/IconEdit';
import { useTranslation } from 'react-i18next';

const Bites = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-bites'],
        queryFn: async () => {
            const { data } = await axios.get(`/bites`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('bites.columns.actions'),
            width: 120,
            renderCell: (params) => (
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className="flex hover:text-danger mt-4"
                        onClick={() => {
                            setOpenDelete(true);
                            setId(params.id!);
                        }}
                    >
                        <IconTrashLines />
                    </button>
                    <span
                        className="flex hover:text-info mt-4"
                        onClick={() => {
                            navigate(`/bites/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        {
            field: 'image',
            headerName: t('bites.columns.image'),
            width: 120,
            renderCell: (params) => (
                <img
                    src={`${imgUrl}/${params.value}`}
                    alt="Recipe"
                    className="w-10 h-10 object-cover rounded-md my-2"
                />
            ),
        },
        { field: 'name_en', headerName: t('bites.columns.name_en'), width: 150 },
        { field: 'name_ar', headerName: t('bites.columns.name_ar'), width: 150 },
        { field: 'description_ar', headerName: t('bites.columns.description_ar'), width: 150 },
        { field: 'description_en', headerName: t('bites.columns.description_en'), width: 150 },
        { field: 'preparation_translations_en', headerName: t('bites.columns.preparation_en'), width: 150 },
        { field: 'preparation_translations_ar', headerName: t('bites.columns.preparation_ar'), width: 150 },
        { field: 'ingredients_translations_en', headerName: t('bites.columns.ingredients_en'), width: 150 },
        { field: 'ingredients_translations_ar', headerName: t('bites.columns.ingredients_ar'), width: 150 },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        name_en: item.name_translations?.en || '',
        name_ar: item.name_translations?.ar || '',
        description_ar: item.description_translations?.ar || '',
        description_en: item.description_translations?.en || '',
        preparation_translations_en: item.preparation_translations?.en || '',
        preparation_translations_ar: item.preparation_translations?.ar || '',
        ingredients_translations_en: item.ingredients_translations?.en || '',
        ingredients_translations_ar: item.ingredients_translations?.ar || '',
        image: item.image,
        video_url: item.video_url,
    }));

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">{t('bites.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            navigate('add');
                        }}
                    >
                        {t('bites.add')}
                    </button>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} />
                </div>
            )}
            <DialougRemove apiPath="/bites" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </>
    );
};

export default Bites;
