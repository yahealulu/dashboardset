import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // ✅
import axios from '../../Api/axios';
import AddState from './AddState';
import DialougRemove from '../../components/UI/DialougRemove';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import { Loader } from '../../components/UI/Loader';

const State = () => {
    const { t } = useTranslation(); // ✅
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectdData, setSelctedData] = useState(null);
    const [id, setId] = useState<any>('');
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-states'],
        queryFn: async () => {
            const { data } = await axios.get(`/states`);
            return data;
        },
    });

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: t('state.actions'), // ✅
            width: 120,
            renderCell: (params) => (
                <div className="flex justify-center items-center">
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
                            setSelctedData(params?.row);
                            setOpenAdd(true);
                        }}
                    >
                        <IconEdit className="w-4.5 h-4.5" />
                    </span>
                </div>
            ),
        },
        { field: 'name', headerName: t('state.name'), flex: 1 }, // ✅
        {
            field: 'country',
            headerName: t('state.country'), // ✅
            renderCell: (params) => <div className="flex justify-start items-center">{params.row.country.name}</div>,
            flex: 1,
        },
    ];

    const prepareRows = data?.data?.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        country: item.country || '',
    }));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('state.title')}</h2> {/* ✅ */}
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            setOpenAdd(true);
                        }}
                    >
                        {t('state.add')} {/* ✅ */}
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
            <DialougRemove apiPath="/states" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
            <AddState selectdData={selectdData} setSelctedData={setSelctedData} open={openAdd} setOpen={setOpenAdd} id={id} refetch={refetch} />
        </div>
    );
};

export default State;
