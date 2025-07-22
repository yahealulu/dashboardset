import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../Api/axios';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import { useTranslation } from 'react-i18next';

interface VisitorItem {
    id: number;
    ip_address: string;
    user_agent: string;
    started_at: string;
    ended_at: string;
    user?: {
        name: string;
        email: string;
    };
}

interface VisitorsApiResponse {
    rows: VisitorItem[];
    total: number;
}

const Visitors = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [userType, setUserType] = useState<'admin' | 'agent'>('admin');
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 15,
    });

const { data, isLoading, refetch } = useQuery<VisitorsApiResponse>({
    queryKey: ['get-sessions', userType, paginationModel.page],
    queryFn: async () => {
        const res = await axios.get(`sessions?user_type=${userType}&status=ended&page=${paginationModel.page + 1}`);
        return {
            rows: res.data?.data?.data || [],
            total: res.data?.data?.total || 0,
        };
    },
});


    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('sessions.actions') || 'Actions',
            width: 100,
            renderCell: (params) => (
                <div className="flex justify-center items-start">
                    <button
                        type="button"
                        className="flex hover:text-red-600 mt-4"
                        onClick={() => {
                            setOpenDelete(true);
                            setId(params.row.id);
                        }}
                    >
                        <IconTrashLines />
                    </button>
                </div>
            ),
        },
        { field: 'user_name', headerName: t('sessions.user') || 'User', flex: 1 },
        { field: 'email', headerName: t('sessions.email') || 'Email', flex: 1 },
        { field: 'ip_address', headerName: t('sessions.ip') || 'IP Address', flex: 1 },
        { field: 'user_agent', headerName: t('sessions.agent') || 'User Agent', flex: 2 },
        { field: 'started_at', headerName: t('sessions.started') || 'Started At', flex: 1 },
        { field: 'ended_at', headerName: t('sessions.ended') || 'Ended At', flex: 1 },
    ];

    const prepareRows = data?.rows.map((item: VisitorItem) => ({
        id: item.id,
        user_name: item.user?.name || '',
        email: item.user?.email || '',
        ip_address: item.ip_address,
        user_agent: item.user_agent,
        started_at: item.started_at,
        ended_at: item.ended_at,
    })) || [];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('sessions.title') || 'Visitors'}</h2>
                <select
                    className="border p-2 rounded-md"
                    value={userType}
                                onChange={(e) => {
                        setPaginationModel((prev) => ({ ...prev, page: 0 }));
                        setUserType(e.target.value as 'admin' | 'agent');
                    }}
                >
                    <option value="admin">{t('sessions.admin') || 'Admin'}</option>
                    <option value="agent">{t('sessions.agent') || 'Agent'}</option>
                </select>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid
                        rows={prepareRows}
                        columns={columns}
                        paginationModel={paginationModel}
                        onPaginationModelChange={(model) => setPaginationModel(model)}
                        paginationMode="server"
                        rowCount={data?.total || 0}
                        autoHeight
                    />
                </div>
            )}

            <DialougRemove
                apiPath="/sessions"
                id={id}
                open={openDelete}
                setOpen={setOpenDelete}
                refetch={refetch}
            />
        </div>
    );
};

export default Visitors;
