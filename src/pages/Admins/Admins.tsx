import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../Api/axios';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

const Admins = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<any>('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-superAdmin'],
        queryFn: async () => {
            const { data } = await axios.get(`/users?role=SuperAdmin`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('admins.actions'),
            width: 120,
            renderCell: (params) => (
                <div className="flex gap-4 justify-center items-center">
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
                            navigate(`/admins/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        { field: 'name', headerName: t('admins.name'), width: 150 },
        { field: 'email', headerName: t('admins.email'), width: 150 },
        { field: 'phone', headerName: t('admins.phone'), width: 110 },
        { field: 'company_name', headerName: t('admins.companyName'), width: 150 },
        { field: 'address', headerName: t('admins.address'), width: 150 },
        { field: 'port', headerName: t('admins.port'), width: 150 },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        email: item.email || '',
        phone: item.phone || '',
        company_name: item.company_name || '',
        address: item.address || '',
        port: item.port || '',
    }));

    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">{t('admins.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            navigate('add');
                        }}
                    >
                        {t('admins.add')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className=" max-h-[600px] w-full overflow-x-auto mt-4  relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} />
                </div>
            )}

            <DialougRemove
                apiPath="/users"
                id={id}
                open={openDelete}
                setOpen={setOpenDelete}
                refetch={refetch}
            />
        </div>
    );
};

export default Admins;
