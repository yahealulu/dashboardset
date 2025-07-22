import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import AddBanners from './AddBanners';
import axios, { imgUrl } from '../../Api/axios';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import DialougRemove from '../../components/UI/DialougRemove';
import { Loader } from '../../components/UI/Loader';
import { useTranslation } from 'react-i18next';

const Banners = () => {
    const { t } = useTranslation();
    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectdData, setSelctedData] = useState(null);
    const [id, setId] = useState<any>('');

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-banners'],
        queryFn: async () => {
            const { data } = await axios.get(`/banners`);
            return data;
        },
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-semibold">{t('banners.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            setOpenAdd(true);
                        }}
                    >
                        {t('banners.add')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.data?.length > 0 ? (
                        data.data.map((banner: any) => (
                            <div key={banner.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                                <img src={`${imgUrl}/${banner.image}`} alt="Banner" className="w-full h-48 object-cover" />

                                <div className="p-4 flex justify-between items-center">
                                    <span className={`text-sm font-medium ${banner.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                        {banner.is_active ? t('banners.active') : t('banners.inactive')}
                                    </span>

                                    <div className="flex gap-2">
                                        <button
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={() => {
                                                setSelctedData(banner);
                                                setOpenAdd(true);
                                            }}
                                        >
                                            <IconEdit className="w-4.5 h-4.5" />
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                setId(banner.id);
                                                setOpenDelete(true);
                                            }}
                                        >
                                            <IconTrashLines />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>{t('banners.noBanners')}</p>
                    )}
                </div>
            )}

            <DialougRemove
                apiPath="/banners"
                id={id}
                open={openDelete}
                setOpen={setOpenDelete}
                refetch={refetch}
            />

            <AddBanners
                selectdData={selectdData}
                setSelctedData={setSelctedData}
                open={openAdd}
                setOpen={setOpenAdd}
                id={id}
                refetch={refetch}
            />
        </div>
    );
};

export default Banners;
