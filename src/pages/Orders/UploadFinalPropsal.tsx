import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import axios, { imgUrl } from '../../Api/axios';
import { toast } from 'react-toastify';
import Input from '../../components/UI/Input';
import { FaFilePdf } from 'react-icons/fa';

const UploadFinalPropsal = ({ open, id, setOpen, refetch }: any) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();
    const [allFiles, setAllFiles] = useState<File[]>([]);
    const { t } = useTranslation();
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const watchedFile = watch('file')?.[0];

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormData) =>
            axios.post(`/orders/${id}/uploadFinalProposal`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }),
    });

    const onSubmit: SubmitHandler<any> = (formValues) => {
        const formData = new FormData();
        if (formValues.file && typeof formValues.file !== 'string') {
            formData.append('final_proposal', formValues.file[0]);
        }
        mutate(formData, {
            onSuccess: (response) => {
                toast.success(t('banners.addSuccess') as string);
                setUploadedFile(response.data.final_proposal);
                refetch();
                setOpen(false);
                reset();
                setAllFiles([]);
            },
        });
    };

    const handleFileClick = (filePath: string) => {
        window.open(`${imgUrl}/${filePath}`, '_blank', 'noopener,noreferrer');
    };

    const renderFilePreview = () => {
        if (!watchedFile && !uploadedFile) return null;

        const isPdf = watchedFile ? 
            watchedFile.type === 'application/pdf' : 
            uploadedFile?.toLowerCase().endsWith('.pdf');


        const fileName = watchedFile ? watchedFile.name : uploadedFile?.split('/').pop();

        return (
            <div 
                onClick={() => uploadedFile && handleFileClick(uploadedFile)}
                className={`flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg ${uploadedFile ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''} transition-colors`}
            >
                <FaFilePdf size={24} className="text-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {fileName}
                </span>
            </div>
        );
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 mx-4">
                        <h1 className="text-center text-lg font-bold mb-4">Upload Final Proposal</h1>

                        <div className="space-y-4">
                            <Input 
                            isPdf={watchedFile ? 
            watchedFile.type === 'application/pdf' : 
            uploadedFile?.toLowerCase().endsWith('.pdf')}
                                type="file" 
                                watch={watch} 
                                register={register} 
                                name="file"
                                label="Final Proposal"
                                rules={{ 
                                    required: 'File is required',
                                    validate: (value: FileList) => {
                                        if (value?.[0]?.type !== 'application/pdf') {
                                            return 'Only PDF files are allowed';
                                        }
                                        return true;
                                    }
                                }}
                                error={errors?.file?.message as string}
                                accept=".pdf"
                            />

                            
                        </div>

                        <div className="flex justify-end mt-6">
                            <button 
                                type="button" 
                                onClick={() => setOpen(false)} 
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400"
                            >
                                {t('common.cancel')}
                            </button>
                            <button 
                                type="submit" 
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" 
                                disabled={isPending}
                            >
                                {isPending ? 'Loading' : t('common.add') || 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default UploadFinalPropsal;
