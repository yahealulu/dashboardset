import { useQuery, useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import IconEdit from '../../components/Icon/IconEdit';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import { Loader } from '../../components/UI/Loader';
import DialougRemove from '../../components/UI/DialougRemove';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import RejectAgents from './RejectAgents';
import { useTranslation } from 'react-i18next';
import { CheckCheckIcon, X } from 'lucide-react';
import AprrovedModelAgent from './AprrovedModelAgent';
import { generateFileExcel } from '../../Api/Excel';

const AprrovedAgnts = () => {
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [openRegect, setOpenRegect] = useState(false);
    const [openApprve, setOpenApprove] = useState(false);
    const [id, setId] = useState<any>('');
    const [statusFilter, setStatusFilter] = useState('approved');
    const [fileName, setFileName] = useState('');
    const { t } = useTranslation();
    const filter = statusFilter === 'approved' ? true : false;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-superAdmin', statusFilter],
        queryFn: async () => {
            const { data } = await axios.get(`/users?role=agent&is_approved=${filter}`);
            return data;
        },
    });

    const { mutate: generateFile, isPending: isGenerating } = generateFileExcel('/generateUsersFile?type=csv' , false);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('approvedAgents.actions'),
            width: 120,
            renderCell: (params) => (
                <div className="flex gap-2 justify-center items-center mt-4">
                    <button
                        type="button"
                        className="flex hover:text-danger"
                        onClick={() => {
                            setOpenDelete(true);
                            setId(params.id!);
                        }}
                    >
                        <IconTrashLines />
                    </button>
                    <span
                        className="flex hover:text-info"
                        onClick={() => {
                            navigate(`/account/aprrovedagnts/${params.id!}`);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                    {statusFilter === 'approved' ? (
                        <span
                            className="flex hover:text-primary cursor-pointer font-semibold"
                            onClick={() => {
                                setOpenRegect(true);
                                setId(params.id!);
                            }}
                        >
                            <X className="text-red-500" />
                        </span>
                    ) : (
                        <span
                            className="flex hover:text-primary font-semibold cursor-pointer"
                            onClick={() => {
                                setOpenApprove(true);
                                setId(params.id!);
                            }}
                        >
                            <CheckCheckIcon className="text-green-500" />
                        </span>
                    )}
                </div>
            ),
        },
        { field: 'name', headerName: t('approvedAgents.name'), width: 150 },
        { field: 'email', headerName: t('approvedAgents.email'), width: 150 },
        { field: 'phone', headerName: t('approvedAgents.phone'), width: 110 },
        { field: 'company_name', headerName: t('approvedAgents.companyName'), width: 150 },
        { field: 'address', headerName: t('approvedAgents.address'), width: 150 },
        { field: 'port', headerName: t('approvedAgents.port'), width: 150 },
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
                <h2 className="text-xl">{t('approvedAgents.title')}</h2>
                <div className="flex gap-2 items-center flex-wrap">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border bg-white outline-none border-gray-300 rounded px-2 py-1 text-sm">
                        <option value="approved">{t('approvedAgents.approved')}</option>
                        <option value="notapproved">{t('approvedAgents.notApproved')}</option>
                    </select>

                    <button type="button" className="btn btn-primary" onClick={() => navigate('add')}>
                        {t('approvedAgents.addAgent')}
                    </button>

                    <button type="button" className="btn btn-secondary !border-none !text-white !bg-green-500" onClick={() => generateFile()} disabled={isGenerating}>
                        {isGenerating ? t('approvedAgents.generating') : t('approvedAgents.generateExcel')}
                    </button>

                    {fileName && (
                        <a href={`${import.meta.env.VITE_MAIN_HOST}/download-products-file/${fileName}`} className="btn btn-success" download>
                            {t('approvedAgents.download')}
                        </a>
                    )}
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="max-h-[600px] w-full overflow-x-auto mt-4 relative z-[10]">
                    <DataGrid rows={prepareRows} columns={columns} />
                </div>
            )}

            <DialougRemove apiPath="/users" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
            <RejectAgents apiPath="/users" id={id} open={openRegect} setOpen={setOpenRegect} refetch={refetch} />
            <AprrovedModelAgent apiPath="/users" id={id} open={openApprve} setOpen={setOpenApprove} refetch={refetch} />
        </div>
    );
};

export default AprrovedAgnts;
