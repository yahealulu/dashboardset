import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import { useQuery } from '@tanstack/react-query';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import DialougRemove from '../../components/UI/DialougRemove';
import { Loader } from '../../components/UI/Loader';
import IconEdit from '../../components/Icon/IconEdit';
import { useTranslation } from 'react-i18next';

const Activities = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-activities'],
        queryFn: async () => {
            const { data } = await axios.get(`/activities`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('activities.actions'),
            width: 120,
            renderCell: (params) => (
                <div className="flex justify-center items-center">
                    <button
                        type="button"
                        className="flex hover:text-danger mt-4"
                        onClick={(e) => {
                            setOpenDelete(true);
                            setId(params.id!);
                        }}
                    >
                        <IconTrashLines />
                    </button>
                    <span
                        className="flex hover:text-info mt-4"
                        onClick={() => {
                            navigate(`/activities/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        {
            field: 'image',
            headerName: t('activities.image'),
            width: 120,
            renderCell: (params) => <img src={`${imgUrl}/${params.value}`} alt="Recipe" onClick={() => console.log(params.value)} className="w-10 h-10 object-cover rounded-md my-2" />,
        },
        { field: 'name_en', headerName: t('activities.name_en'), width: 150 },
        { field: 'name_ar', headerName: t('activities.name_ar'), width: 150 },
        { field: 'description_ar', headerName: t('activities.description_ar'), width: 150 },
        { field: 'description_en', headerName: t('activities.description_en'), width: 150 },
        { field: 'location_translations_en', headerName: t('activities.location_en'), width: 150 },
        { field: 'location_translations_ar', headerName: t('activities.location_ar'), width: 150 },
        { field: 'type', headerName: t('activities.type'), width: 150 },
        { field: 'event_date', headerName: t('activities.event_date'), width: 150 },
    ];

    const prepareRows = data?.data?.map((item : any) => ({
        id: item.id,
        name_en: item.name_translations?.en || '',
        name_ar: item.name_translations?.ar || '',
        description_ar: item.description_translations?.ar || '',
        description_en: item.description_translations?.en || '',
        location_translations_en: item.location_translations?.en || '',
        location_translations_ar: item.location_translations?.ar || '',
        image: item.images,
        type: item.type,
        event_date: item.event_date,
    }));

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">{t('activities.activities')}</h2>
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            navigate('add');
                        }}
                    >
                        {t('activities.add_activity')}
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

            <DialougRemove apiPath="/activities" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </>
    );
};

export default Activities;
