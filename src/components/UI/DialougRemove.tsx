import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query';
import React, { FC } from 'react';
import { toast } from 'react-toastify';
import axios from '../../Api/axios';
import { useTranslation } from 'react-i18next';

const DialougRemove: FC<{
    label?: string;
    open: boolean;
    setOpen: (arg: boolean) => void;
    className?: string;
    id: any;
    apiPath: string;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>;
}> = ({ label, open, setOpen, className, refetch, id, apiPath }) => {
    const { t } = useTranslation();

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const res = await axios.delete(`${apiPath}/${id}`);
            return res;
        },
        onSuccess: () => {
            toast.success(t('dialogRemove.toastSuccess') as string);
            setOpen(false);
            refetch?.();
        },
        onError: (errorMessage: any) => {
            toast.error(errorMessage);
        },
    });

    const onDelete = () => {
        mutate(id);
    };

    return (
        <>
            {open && (
                <div className="fixed z-[1000000] inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <div className="bg-white z-[10000] dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="font-semibold text-center text-nowrap">
                            {label ? label : t('dialogRemove.confirmation')}
                        </h1>
                        <div className="flex gap-4 mt-4 justify-center items-center">
                            <button className="btn btn-primary" onClick={onDelete} disabled={isPending}>
                                {t('dialogRemove.yes')}
                            </button>
                            <button onClick={() => setOpen(false)}>{t('dialogRemove.no')}</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DialougRemove;
