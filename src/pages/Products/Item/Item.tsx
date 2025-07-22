import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { imgUrl } from '../../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import IconEdit from '../../../components/Icon/IconEdit';
import { Loader } from '../../../components/UI/Loader';
import DialougRemove from '../../../components/UI/DialougRemove';
import { useTranslation } from 'react-i18next';

const Item = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-variants'],
        queryFn: async () => {
            const { data } = await axios.get(`/products/${params.id}/variants`);
            return data.data.data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'actions',
            headerName: t('bites.columns.actions'),
            width: 160,
            renderCell: (paramsss) => (
                <div className="flex justify-center gap-1 items-center">
                    <button
                        type="button"
                        className="flex hover:text-danger mt-4"
                        onClick={() => {
                            setOpenDelete(true);
                            setId(paramsss.row.id);
                        }}
                    >
                        <IconTrashLines />
                    </button>
                    <span className="flex hover:text-info mt-4 ml-2 cursor-pointer" onClick={() => navigate(`/products/item/${params.id}/${paramsss.row.id}`)}>
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                    <button
                        type="button"
                        className="flex hover:text-danger mt-4"
                        onClick={() => {
                            navigate(`/rating/add/ProductVariant/${paramsss.row.id}`);
                        }}
                    >
                        {t('rating.title')}
                    </button>
                
                    <button
                        type="button"
                        className="flex hover:text-danger mt-4"
                        onClick={() => {
                            navigate(`/prices/add/${paramsss.row.id}`);
                        }}
                    >
                        {t('prices.title')}
                    </button>
                </div>
            ),
        },
        {
            field: 'image',
            headerName: t('image'),
            width: 120,
            renderCell: (params) => (
                <img src={`${imgUrl}/${params.value}`} alt="Product" className="w-10 h-10 object-cover rounded-md my-2" />
            ),
        },
        { field: 'size', headerName: t('size'), width: 50 },
        { field: 'box_dimensions', headerName: t('boxDimensions'), width: 120 },
        { field: 'box_packing', headerName: t('boxPacking'), width: 130 },
        { field: 'free_quantity', headerName: t('freeQuantity'), width: 130 },
        { field: 'gross_weight', headerName: t('grossWeight'), width: 130 },
        { field: 'net_weight', headerName: t('netWeight'), width: 130 },
        { field: 'standard_weight', headerName: t('standardWeight'), width: 150 },
        { field: 'tare_weight', headerName: t('tareWeight'), width: 130 },
        { field: 'packaging', headerName: t('packaging'), width: 130 },
        {
            field: 'in_stock',
            headerName: t('inStock'),
            width: 100,
            renderCell: (params) => (
                <div className="flex justify-center items-center">{params.row.in_stock === 1 ? t('yes') : t('no')}</div>
            ),
        },
        {
            field: 'is_new',
            headerName: t('isNew'),
            width: 100,
            renderCell: (params) => (
                <div className="flex justify-center items-center">{params.row.is_new === 1 ? t('yes') : t('no')}</div>
            ),
        },
        {
            field: 'is_hidden',
            headerName: t('isHidden'),
            width: 100,
            renderCell: (params) => (
                <div className="flex justify-center items-center">{params.row.is_hidden === 1 ? t('yes') : t('no')}</div>
            ),
        },
    ];

    const prepareRows = data?.map((item: any) => ({
        id: item.id,
        image: item.image,
        size: item.size,
        box_dimensions: item.box_dimensions,
        box_packing: item.box_packing,
        free_quantity: item.free_quantity,
        gross_weight: item.gross_weight,
        net_weight: item.net_weight,
        standard_weight: item.standard_weight,
        tare_weight: item.tare_weight,
        packaging: item.packaging,
        in_stock: item.in_stock,
        is_new: item.is_new,
        is_hidden: item.is_hidden,
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('items')}</h2>
                <div className="flex gap-2 items-center">
                    <button type="button" className="btn btn-primary" onClick={() => navigate('add')}>
                        {t('addItem')}
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
            <DialougRemove apiPath={`/products/${params.id}/variants`} id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </div>
    );
};

export default Item;
