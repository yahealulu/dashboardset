import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../Api/axios';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import DialogEditPrice from './DialogEditPrice';
import { useTranslation } from 'react-i18next';

const Prices = () => {
    const { t, i18n } = useTranslation();

    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        id: 0,
        piece_price: 0,
        box_price: 0,
    });

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-prices'],
        queryFn: async () => {
            const res = await axios.get(`/prices`);
            return res.data?.data;
        },
    });

    const currentLang = i18n.language || localStorage.getItem('i18nextLng') || 'en';

    const prepareRows = useMemo(() => {
        return data?.map((item: any) => ({
            id: item.id,
            product_name: currentLang === 'ar' ? item.product_variant?.product?.name?.ar || '' : item.product_variant?.product?.name?.en || '',
            size: item.product_variant?.size || '',
            piece_price: item.piece_price,
            box_price: item.box_price !== null && item.box_price !== undefined ? item.box_price : 0,
        }));
    }, [data, currentLang]);

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: t('prices.actions'),
            width: 140,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setEditData({
                                id: params.row.id,
                                piece_price: Number(params.row.piece_price),
                                box_price: Number(params.row.box_price),
                            });
                            setOpenEdit(true);
                        }}
                        className="hover:text-blue-600"
                        type="button"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={() => {
                            setDeleteId(params.row.id);
                            setOpenDelete(true);
                        }}
                        className="hover:text-red-600"
                        type="button"
                    >
                        <IconTrashLines />
                    </button>
                </div>
            ),
        },
        {
            field: 'product_name',
            headerName: t('prices.productName'),
            flex: 2,
        },
        {
            field: 'size',
            headerName: t('prices.size'),
            flex: 1,
        },
        {
            field: 'piece_price',
            headerName: t('prices.piecePrice'),
            flex: 1,
        },
        {
            field: 'box_price',
            headerName: t('prices.boxPrice'),
            flex: 1,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('prices.title')}</h2>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows || []} columns={columns} autoHeight />
                </div>
            )}

            <DialougRemove apiPath="/prices" id={deleteId} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />

            <DialogEditPrice
                open={openEdit}
                setOpen={setOpenEdit}
                id={editData.id}
                initialData={{
                    piece_price: editData.piece_price,
                    box_price: editData.box_price,
                }}
                refetch={refetch}
            />
        </div>
    );
};

export default Prices;
