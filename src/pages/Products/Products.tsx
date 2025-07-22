import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
    import Barcode from 'react-barcode';
import { useTranslation } from 'react-i18next';
import { generateFileExcel } from '../../Api/Excel';

const Products = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-products'],
        queryFn: async () => {
            const { data } = await axios.get(`/products`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('products.actions'),
            width: 160,
            renderCell: (params) => (
                <div className="flex justify-center gap-1 items-center">
                    <button
                        type="button"
                        className="flex hover:text-danger "
                        onClick={() => {
                            setOpenDelete(true);
                            setId(params.id!);
                        }}
                    >
                        <IconTrashLines />
                    </button>
                    <span className="flex hover:text-info  ml-2 cursor-pointer" onClick={() => navigate(`/products/${params.id!}`)}>
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                    <button
                        type="button"
                        className="flex hover:text-danger "
                        onClick={() => {
                            navigate(`/offers/${params.row.id}`);
                        }}
                    >
                        {t('offers.title')}
                    </button>
                    <span className="flex hover:text-primary border-b-2 border-primary ml-2 cursor-pointer" onClick={() => navigate(`/products/item/${params.id!}`)}>
                        {t('products.items')}
                    </span>
                </div>
            ),
        },
        {
            field: 'image',
            headerName: t('products.image'),
            width: 120,
            renderCell: (params) => <img src={`${imgUrl}/${params.value}`} alt="Product" className="w-10 h-10 object-cover rounded-md my-2" />,
        },
        {
            field: 'barcode',
            headerName: t('products.barcode'),
            width: 150,
            renderCell: (params) =>
                params.value ? (
                    <div className="scale-90">
                        <Barcode value={params.value} width={1} height={30} displayValue={false} />
                    </div>
                ) : (
                    t('products.na')
                ),
        },
        { field: 'country', headerName: t('products.country'), width: 120 },
        { field: 'name_en', headerName: t('products.name_en'), width: 120 },
        { field: 'name_ar', headerName: t('products.name_ar'), width: 120 },
        { field: 'name_fr', headerName: t('products.name_fr'), width: 120 },
        { field: 'desc_en', headerName: t('products.desc_en'), width: 160 },
        { field: 'desc_ar', headerName: t('products.desc_ar'), width: 160 },
        { field: 'in_stock', headerName: t('products.in_stock'), width: 100 },
        { field: 'is_hidden', headerName: t('products.is_hidden'), width: 100 },
        { field: 'is_new', headerName: t('products.is_new'), width: 100 },
        { field: 'material_property', headerName: t('products.material_property'), width: 120 },
        { field: 'weight_unit', headerName: t('products.weight_unit'), width: 100 },
        { field: 'product_category', headerName: t('products.product_category'), width: 140 },
        { field: 'product_code', headerName: t('products.product_code'), width: 120 },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        image: item.image,
        barcode: item.barcode,
        country: item.country_origin_id?.name || '',
        created_at: item.created_at,
        updated_at: item.updated_at,
        in_stock: item.in_stock,
        is_hidden: item.is_hidden,
        is_new: item.is_new,
        material_property: item.material_property,
        weight_unit: item.weight_unit,
        product_category: item.product_category,
        product_code: item.product_code,
        name_en: item.name_translations?.en || '',
        name_ar: item.name_translations?.ar || '',
        name_fr: item.name_translations?.fr || '',
        desc_en: item.description_translations?.en || '',
        desc_ar: item.description_translations?.ar || '',
    }));
    const { mutate: generateFile, isPending: isGenerating } = generateFileExcel('/export-products', true);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('products.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button type="button" className="btn btn-primary" onClick={() => navigate('add')}>
                        {t('products.add')}
                    </button>
                    <button type="button" className="btn btn-secondary !border-none !text-white !bg-green-500" onClick={() => generateFile()} disabled={isGenerating}>
                        {isGenerating ? t('approvedAgents.generating') : t('approvedAgents.generateExcel')}
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
            <DialougRemove apiPath="/products" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </div>
    );
};

export default Products;
