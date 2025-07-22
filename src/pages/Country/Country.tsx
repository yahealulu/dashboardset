import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import { useTranslation } from 'react-i18next';

const Country = () => {
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');
    const { t } = useTranslation();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-countries'],
        queryFn: async () => {
            const { data } = await axios.get(`/countries`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('countries.actions'),
            width: 120,
            renderCell: (params: any) => (
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
                        className="flex hover:text-info mt-4 cursor-pointer"
                        onClick={() => {
                            navigate(`/country/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        { field: 'name', headerName: t('countries.name'), width: 120 },
        { field: 'code', headerName: t('countries.code'), width: 100 },
        { field: 'type', headerName: t('countries.type'), width: 100 },
        {
            field: 'air',
            headerName: t('countries.air'),
            width: 80,
            valueFormatter: (params: any) => (params.value ? t('common.yes') : t('common.no')),
        },
        {
            field: 'sea',
            headerName: t('countries.sea'),
            width: 80,
            valueFormatter: (params: any) => (params.value ? t('common.yes') : t('common.no')),
        },
        {
            field: 'land',
            headerName: t('countries.land'),
            width: 80,
            valueFormatter: (params: any) => (params.value ? t('common.yes') : t('common.no')),
        },
        {
            field: 'sea_allowed_sizes',
            headerName: t('countries.seaSizes'),
            width: 220,
            renderCell: (params: any) => (
                <div className="flex flex-wrap gap-2">
                    {params.value.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-1 border p-1 rounded bg-gray-100">
                            <p>{item.size}</p>
                            {item.freezed && <span className="text-xs text-red-500">({t('countries.freezed')})</span>}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            field: 'land_allowed_sizes',
            headerName: t('countries.landSizes'),
            width: 220,
            renderCell: (params: any) => (
                <div className="flex flex-wrap gap-2">
                    {params.value.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-1 border p-1 rounded bg-gray-100">
                            <p>{item.size}</p>
                            {item.freezed && <span className="text-xs text-red-500">({t('countries.freezed')})</span>}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            field: 'air_allowed_sizes',
            headerName: t('countries.airSizes'),
            width: 220,
            renderCell: (params: any) => (
                <div className="flex flex-wrap gap-2">
                    {params.value.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-1 border p-1 rounded bg-gray-100">
                            <p>{item.size}</p>
                            {item.freezed && <span className="text-xs text-red-500">({t('countries.freezed')})</span>}
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        code: item.code || '',
        type: item.type || '',
        air: item.air,
        sea: item.sea,
        land: item.land,
        sea_allowed_sizes: item.sea_allowed_sizes || [],
        land_allowed_sizes: item.land_allowed_sizes || [],
        air_allowed_sizes: item.air_allowed_sizes || [],
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('countries.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button type="button" className="btn btn-primary" onClick={() => navigate('add')}>
                        {t('countries.add')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} getRowHeight={() => 'auto'} />
                </div>
            )}

            <DialougRemove apiPath="/countries" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </div>
    );
};

export default Country;
