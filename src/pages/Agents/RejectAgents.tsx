import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import React, { FC } from 'react';
import { toast } from 'react-toastify';
import axios from '../../Api/axios';
import { useTranslation } from 'react-i18next';

const RejectAgents: FC<{
    label?: string;
    open: boolean;
    setOpen: (arg: boolean) => void;
    className?: string;
    id: any;
    apiPath: string;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
}> = ({ open, setOpen, className, refetch, id }) => {
    const { t } = useTranslation();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const res = await axios.post(`users/${id}/reject`);
            return res;
        },
        onSuccess: () => {
            toast.success(t('rejectAgents.toastSuccess') as string);
            setOpen(false);
            refetch?.();
        },
        onError: (errorMessage: any) => {
            toast.error(errorMessage);
        },
    });

    const onReject = () => {
        mutate(id);
    };

    return (
        <>
            {open && (
                <div className="fixed z-[1000000] inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white z-[10000] dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="font-semibold text-center text-nowrap">
                            {t('rejectAgents.confirmation')}
                        </h1>
                        <div className="flex gap-4 mt-4 justify-center items-center">
                            <button className="btn btn-primary" onClick={onReject} disabled={isPending}>
                                {t('rejectAgents.yes')}
                            </button>
                            <button onClick={() => setOpen(false)}>{t('rejectAgents.no')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RejectAgents;
