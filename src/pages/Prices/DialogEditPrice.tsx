import React, { FC, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from '../../Api/axios';
import { useTranslation } from 'react-i18next';

type DialogEditPriceProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    id: number;
    initialData: {
        piece_price: number;
        box_price: number;
    };
    refetch: () => void;
};

const DialogEditPrice: FC<DialogEditPriceProps> = ({ open, setOpen, id, initialData, refetch }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        piece_price: '',
        box_price: '',
    });

    useEffect(() => {
        setFormData({
            piece_price: initialData.piece_price?.toString() || '',
            box_price: initialData.box_price?.toString() || '',
        });
    }, [initialData]);

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return axios.put(`/prices/${id}`, {
                piece_price: Number(formData.piece_price),
                box_price: Number(formData.box_price),
            });
        },
        onSuccess: () => {
            toast.success('Edit success');
            setOpen(false);
            refetch();
        },
        onError: () => {
            toast.error('An error occurred while editing');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        if (!formData.piece_price) {
            toast.warn('Piece price required');
            return;
        }
        mutate();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
        <h2 className="text-lg font-semibold mb-4">{t('prices.editTitle')}</h2>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="piece_price" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('prices.piecePrice')}
                        </label>
                        <input
                            id="piece_price"
                            type="number"
                            name="piece_price"
                            placeholder={t('prices.piecePrice')}
                            value={formData.piece_price}
                            onChange={handleChange}
                            className="w-full p-3 text-base border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="box_price" className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('prices.boxPrice')}
                        </label>
                        <input
                            id="box_price"
                            type="number"
                            name="box_price"
                            placeholder={t('prices.boxPrice')}
                            value={formData.box_price}
                            onChange={handleChange}
                            className="w-full p-3 text-base border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={() => setOpen(false)} className="btn btn-outline">
                        {t('common.cancel')}
                    </button>
                    <button onClick={handleSubmit} className="btn btn-primary" disabled={isPending}>
                        {t('common.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialogEditPrice;
