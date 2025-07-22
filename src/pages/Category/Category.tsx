import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import Country from '../Country/Country';
import { useTranslation } from 'react-i18next';

const Category = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-categories'],
        queryFn: async () => {
            const { data } = await axios.get(`/categories`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('category.actions'),
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
                            navigate(`/company-industry/category/edit/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        {
            field: 'image',
            headerName: t('category.image'),
            width: 120,
            renderCell: (params) => (
                <img
                    src={`${imgUrl}/${params.value}`}
                    alt="Recipe"
                    onClick={() => console.log(params.value)}
                    className="w-10 h-10 object-cover rounded-md my-2"
                />
            ),
        },
        { field: 'country', headerName: t('category.country'), width: 100 },
        { field: 'name_en', headerName: t('category.name_en'), width: 100 },
        { field: 'name_ar', headerName: t('category.name_ar'), width: 100 },
        { field: 'name_fr', headerName: t('category.name_fr'), width: 100 },
        { field: 'name_de', headerName: t('category.name_de'), width: 100 },
        { field: 'name_tr', headerName: t('category.name_tr'), width: 100 },
        { field: 'name_fa', headerName: t('category.name_fa'), width: 100 },
        { field: 'name_ru', headerName: t('category.name_ru'), width: 100 },
        { field: 'name_zh', headerName: t('category.name_zh'), width: 100 },
        { field: 'name_da', headerName: t('category.name_da'), width: 100 },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        image: item.image,
        name_en: item.name_translations?.en || '',
        name_ar: item.name_translations?.ar || '',
        name_fr: item.name_translations?.fr || '',
        name_de: item.name_translations?.de || '',
        name_tr: item.name_translations?.tr || '',
        name_fa: item.name_translations?.fa || '',
        name_ru: item.name_translations?.ru || '',
        name_zh: item.name_translations?.zh || '',
        name_da: item.name_translations?.da || '',
        country: item.country_origin_id?.name || '',
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('category.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            navigate('add');
                        }}
                    >
                        {t('category.add')}
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
            <DialougRemove
                apiPath="/categories"
                id={id}
                open={openDelete}
                setOpen={setOpenDelete}
                refetch={refetch}
            />
        </div>
    );
};

export default Category;
