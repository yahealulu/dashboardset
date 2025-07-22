import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Barcode from 'react-barcode';
import { Loader } from '../../components/UI/Loader';
import { Checkbox, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SelectableProducts = ({ selectedProducts, setSelectedProducts }: { selectedProducts: any[]; setSelectedProducts: React.Dispatch<React.SetStateAction<any[]>> }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-variants'],
        queryFn: async () => {
            const { data } = await axios.get(`/products/${params.itemId}/variants`);
            return data.data.data;
        },
    });
    console.log(data);
    const allProducts = data || [];

    const handleCheckboxChange = (product: any) => {
        const alreadySelected = selectedProducts.find((p) => p.id === product.id);
        if (alreadySelected) {
            setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, product]);
        }
    };

    const handleSelectAll = () => {
        setSelectedProducts(allProducts);
    };

    const handleDeselectAll = () => {
        setSelectedProducts([]);
    };

    const columns: GridColDef[] = [
        {
            field: 'select',
            headerName: '',
            width: 50,
            renderCell: (params) => <Checkbox checked={selectedProducts.some((p) => p.id === params.row.id)} onChange={() => handleCheckboxChange(params.row)} />,
        },
        {
            field: 'image',
            headerName: t('image'),
            width: 120,
            renderCell: (params) => <img src={`${imgUrl}/${params.value}`} alt="Product" className="w-10 h-10 object-cover rounded-md my-2" />,
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
            renderCell: (params) => <div className="flex justify-center items-center">{params.row.in_stock === 1 ? t('yes') : t('no')}</div>,
        },
        {
            field: 'is_new',
            headerName: t('isNew'),
            width: 100,
            renderCell: (params) => <div className="flex justify-center items-center">{params.row.is_new === 1 ? t('yes') : t('no')}</div>,
        },
        {
            field: 'is_hidden',
            headerName: t('isHidden'),
            width: 100,
            renderCell: (params) => <div className="flex justify-center items-center">{params.row.is_hidden === 1 ? t('yes') : t('no')}</div>,
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
        <div className="flex flex-col gap-6 mt-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{t('products.select_products')}</h2>
                <div className="flex gap-2">
                    <Button variant="contained" color="primary" onClick={handleSelectAll}>
                        {t('products.select_all')}
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleDeselectAll}>
                        {t('products.clear_all')}
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} checkboxSelection={false} disableRowSelectionOnClick pageSizeOptions={[10, 20, 50]} />
                </div>
            )}
        </div>
    );
};

export default SelectableProducts;
