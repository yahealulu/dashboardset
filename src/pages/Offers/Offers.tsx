import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import { useTranslation } from 'react-i18next';

const Offers = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-offers'],
        queryFn: async () => {
            const { data } = await axios.get(`/offers`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('offers.actions'),
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
                            navigate(`/offers/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        {
            field: 'products',
            headerName: t('offers.products'),
            flex: 1,
            renderCell: (params) => <div className="flex justify-start items-center mt-4">{params.row.variants?.map((d: any) => d.name_translations.en)}</div>,
        },
        {
            field: 'image',
            headerName: t('offers.image'),
            flex: 1,
            renderCell: (params) => <img src={`${imgUrl}/${params.value}`} alt="img" onClick={() => console.log(params.value)} className="w-10 h-10 object-cover rounded-md my-2" />,
        },
        {
            field: 'discount_percentage',
            headerName: t('offers.discountPercentage'),
            flex: 1,
            renderCell: (params) => <div className="flex justify-start items-center mt-4">{params.row.discount_percentage}</div>,
        },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        image: item.image || '',
        discount_percentage: item.discount_percentage || '',
        products: item.products || '',
    }));

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">{t('offers.title')}</h2>
                      <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            navigate('add');
                        }}
                    >
                        {t('offers.add')}
                    </button>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className=" max-h-[600px] w-full overflow-x-auto mt-4  relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} getRowHeight={() => 'auto'} />
                </div>
            )}

            <DialougRemove apiPath="/offers" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </div>
    );
};

export default Offers;
