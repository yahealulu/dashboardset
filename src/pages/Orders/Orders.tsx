import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import axios, { imgUrl } from '../../Api/axios';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Loader } from '../../components/UI/Loader';
import UploadShipmentFile from './UploadShipmentFile';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import OrderInfo from './OrderInfo';
import IconInfoCircle from '../../components/Icon/IconInfoCircle';
import { toast } from 'react-toastify';
import UploadFinalPropsal from './UploadFinalPropsal';
import UploadFinalInvoice from './UploadFinalInvoice';
import UpdateShippingStatus from './UpdateShippingStatus';
import { FaFilePdf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Waiting For Shipment', value: 'waiting_for_shipment' },
    { label: 'Admin Approved', value: 'admin_approved' },
    { label: 'Admin Not Approved', value: 'admin_not_approved' },
    { label: 'Final Invoice Sent', value: 'final_invoice_sent' },
    { label: 'User Approved', value: 'user_approved' },
    { label: 'User Not Approved', value: 'user_not_approved' },
    { label: 'Waiting Payment', value: 'waiting_payment' },
    { label: 'Delivered', value: 'delivered' },

    { label: 'Finished', value: 'finished' },
    { label: 'Freezed', value: 'freezed' },
];

const Orders = () => {
    const [statusFilter, setStatusFilter] = useState('pending');
    const [openUploadShipmentFile, setOpenUploadShipmentFile] = useState(false);
    const [openUploadFinalPropsal, setOpenUploadFinalPropsale] = useState(false);
    const [openUploadFinalInvoice, setOpenUploadFinalInvoice] = useState(false);
    const [openUpdateShipping, setOpenUpdateShipping] = useState(false);

    const [openOrderModal, setOpenOrderModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [id, setId] = useState<number | false>(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState<{ [key: number]: boolean }>({});
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-orders', statusFilter],
        queryFn: async () => {
            const { data } = await axios.get(`/orders?status=${statusFilter}`);
            return data;
        },
    });

    const handleRowClick = (params: any) => {
        setSelectedOrder(params?.row);
        setOpenOrderModal(true);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) =>
            axios.post(`/orders/${data.id}`, {
                status: data.status,
                _method: 'PUT',
            }),
    });

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        setStatusUpdateLoading((prev) => ({ ...prev, [orderId]: true }));
        const StatausData = {
            status: newStatus,
            _method: 'PUT',
            id: orderId,
        };
        mutate(StatausData, {
            onSuccess: () => {
                toast.success(t('banners.addSuccess') as string);
                refetch();
            },
        });
    };

    const baseColumns: GridColDef[] = [
        {
            field: 'info',
            headerName: `Info`,
            renderCell: (params) => (
                <div onClick={() => navigate(`${params.row.id}`)} className="mt-4 flex justify-centet items-center">
                    <IconInfoCircle />
                </div>
            ),
        },
        {
            field: 'status',
            headerName: t('Status'),
           flex:1,
            renderCell: (params) => <p className="text-start">{t(params.row.status)}</p>,
        },
        {
            field: 'user',
            headerName: t('User'),
            flex:1,
            renderCell: (params) => <p className="text-start">{params.row.user.name}</p>,
        },
        // {
        //     field: 'payment_info',
        //     headerName: t('Payment Info'),
        //     flex: 1,
        //     renderCell: (params) => <p className="text-start">{params.row.payment_info}</p>,
        // },

        // {
        //   field: 'final_proposal',
        //   headerName: t('Final Proposal'),
        //   flex: 1,
        //   renderCell: (params) => <p className="text-start">{params.row.final_proposal}</p>,
        // },
    ];

    const updateColumn: GridColDef = {
        field: 'update_status',
        headerName: t('Update Status'),
           flex:1,
        renderCell: (params) => {
            const orderId = params.row.id;
            const currentStatus = params.row.status;

            if (currentStatus === 'pending') {
                return (
                    <select
                        defaultValue=""
                        onChange={(e) => handleStatusChange(orderId, e.target.value)}
                        disabled={isPending}
                        className="border bg-white outline-none border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value="" disabled>
                            {t('Select Status')}
                        </option>
                        <option value="admin_approved">{t('Admin Approved')}</option>
                        <option value="admin_not_approved">{t('Admin Not Approved')}</option>
                    </select>
                );
            } else {
                return null;
            }
        },
    };

    let columns: GridColDef[] = [...baseColumns];

    // حدد موقع عمود الـ user
    const userIndex = columns.findIndex((col) => col.field === 'user');

    // أضف عمود تحديث الحالة إن لزم
    if (statusFilter === 'waiting_for_shipment') {
        columns.splice(userIndex + 1, 0, {
            field: 'update_status',
            headerName: t('Update Status'),
            flex: 1,
            renderCell: (params) => (
                <button
                    onClick={() => handleStatusChange(params.row.id, 'finished')}
                    disabled={isPending}
                    className="bg-green-600 text-sm text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    {isPending ? t('common.loading') : t('Mark as Finished')}
                </button>
            ),
        });
    }

    if (statusFilter === 'pending') {
        columns.splice(userIndex + 1, 0, {
           field: 'update_status',
        headerName: t('Update Status'),
           flex:1,
            renderCell: (params) => (
                <select
                        defaultValue=""
                        onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
                        disabled={isPending}
                        className="border bg-white outline-none border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value="" disabled>
                            {t('Select Status')}
                        </option>
                        <option value="admin_approved">{t('Admin Approved')}</option>
                        <option value="admin_not_approved">{t('Admin Not Approved')}</option>
                    </select>
            ),
        });
    }

    // أضف عمود رفع المقترح النهائي
    if (statusFilter === 'admin_approved') {
        columns.splice(userIndex + 1, 0, {
            field: 'upload_final_proposal',
            headerName: t('Upload Final Proposal'),
               flex:1,
            renderCell: (params) => (
                <button
                    onClick={() => {
                        setId(params.row.id);
                        setOpenUploadFinalPropsale(true);
                    }}
                    className="bg-primary text-sm text-white px-4 py-2 rounded-lg w-fit h-fit"
                >
                    {t('Upload Final Proposal')}
                </button>
            ),
        });
    }
    if (statusFilter === 'user_approved') {
        columns.splice(userIndex + 1, 0, {
            field: 'upload_final_invoice',
            headerName: t('Upload Final Invoice'),
               flex:1,
            renderCell: (params) => (
                <button
                    onClick={() => {
                        setId(params.row.id);
                        setOpenUploadFinalInvoice(true);
                    }}
                    className="bg-primary text-sm text-white px-4 py-2 rounded-lg w-fit h-fit"
                >
                    {t('Upload Final Invoice')}
                </button>
            ),
        });
    }
    if (statusFilter === 'waiting_payment') {
        columns.splice(
            userIndex + 1,
            0,
            {
                field: 'update_shipping',
                headerName: t('Update Shipping'),
                flex: 1,
                renderCell: (params) => (
                    <button
                        onClick={() => {
                            setId(params.row.id);
                            setOpenUpdateShipping(true);
                        }}
                        className="bg-blue-500 text-sm text-white px-4 py-2 rounded-lg w-fit h-fit"
                    >
                        {t('Update')}
                    </button>
                ),
            },
            {
                field: 'final_invoice',
                headerName: t('Final Invoice'),
                flex: 1,
                renderCell: (params) => (
                    <div
                        onClick={() => {
                            window.open(`${imgUrl}/${params.row.final_invoice}`, '_blank', 'noopener,noreferrer');
                        }}
                        className="cursor-pointer flex items-center justify-start mt-4"
                    >
                        <FaFilePdf size={26} color="#E53935" />
                    </div>
                ),
            }
        );
    }
    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        status: item.status,
        payment_info: item.payment_info,
        final_invoice: item.final_invoice?.final_invoice,
        final_proposal: item.final_proposal,
        user: item.user,
        shipmentFiles: item.shipmentFiles,
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('Orders')}</h2>
                <div>
                    <label>{t('Status')}</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border bg-white outline-none border-gray-300 rounded px-2 py-1 text-sm">
                        {statusOptions.map((st, i) => (
                            <option key={i} value={st.value}>
                                {t(st.label)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} />
                </div>
            )}

            <UploadShipmentFile id={id} open={openUploadShipmentFile} setOpen={setOpenUploadShipmentFile} refetch={refetch} />
            <UploadFinalPropsal id={id} open={openUploadFinalPropsal} setOpen={setOpenUploadFinalPropsale} refetch={refetch} />
            <UploadFinalInvoice id={id} open={openUploadFinalInvoice} setOpen={setOpenUploadFinalInvoice} refetch={refetch} />
            <UpdateShippingStatus id={id} open={openUpdateShipping} setOpen={setOpenUpdateShipping} refetch={refetch} />
        </div>
    );
};

export default Orders;
