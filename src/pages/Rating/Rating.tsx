import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import { useTranslation } from 'react-i18next';

const Rating = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-ratings'],
        queryFn: async () => {
            const { data } = await axios.get(`/ratings/user?type=ProductVariant`);
            return data?.data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('rating.actions'),
            width: 120,
            renderCell: (params) => (
                <div className="flex justify-center items-start">
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
                </div>
            ),
        },
        {
            field: 'image',
            headerName: t('rating.image'),
            flex: 1,
            renderCell: (params) => <img src={`${imgUrl}/${params.value}`} alt={t('rating.productImageAlt')} className="w-10 h-10 object-cover rounded-md my-2" />,
        },
        {
            field: 'rating',
            headerName: t('rating.rating'),
            flex: 1,
            renderCell: (params) => <p className="text-start">{params.row.rating}</p>,
        },
        { field: 'comment', headerName: t('rating.comment'), flex: 1, renderCell: (params) => <p className="text-start">{params.row.comment}</p> },
    ];

    const prepareRows = data?.map((item: any) => ({
        id: item.id,
        rating: item.rating,
        comment: item.comment,
        image: item.rateable?.image,
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('rating.title')}</h2>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} />
                </div>
            )}
            <DialougRemove apiPath="/ratings" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </div>
    );
};

export default Rating;
