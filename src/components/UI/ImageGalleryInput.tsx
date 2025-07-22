import React, { FC, useEffect, useMemo } from 'react';
import { FieldValues, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { imgUrl } from '../../Api/axios';
import { Trash2 } from 'lucide-react'; // أيقونة الحذف
import { FaFilePdf } from 'react-icons/fa';
import { FaFileWord } from 'react-icons/fa';
import { FaFileExcel } from 'react-icons/fa';
import { FaFile } from 'react-icons/fa';

type Props = {
    name: string;
    label?: string;
    register: UseFormRegister<FieldValues>;
    watch: UseFormWatch<FieldValues>;
    allFiles: File[];
    setAllFiles: (arg: File[]) => void;
    classNameParent?: string;
};

const ImageGalleryInput: FC<Props> = ({ name, label, register, watch, allFiles, setAllFiles, classNameParent }) => {
    const files = watch(name) as FileList | undefined;

    useEffect(() => {
        if (!files) return;
        const newFiles = Array.from(files);
        setAllFiles((prevFiles) => {
            const uniqueFiles = newFiles.filter(
                (newFile) => !prevFiles.some((prevFile) => 
                    typeof prevFile !== 'string' && 
                    prevFile.name === newFile.name && 
                    prevFile.size === newFile.size
                )
            );
            return [...prevFiles, ...uniqueFiles];
        });
    }, [files, setAllFiles]);

    const handleRemoveFile = (index: number) => {
        setAllFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];
            updatedFiles.splice(index, 1);
            return updatedFiles;
        });
    };

    const getFileIcon = (file: File | string) => {
        if (typeof file === 'string') {
            const extension = file.split('.').pop()?.toLowerCase();
            switch (extension) {
                case 'pdf': return <FaFilePdf size={24} className="text-red-500" />;
                case 'doc':
                case 'docx': return <FaFileWord size={24} className="text-blue-500" />;
                case 'xls':
                case 'xlsx': return <FaFileExcel size={24} className="text-green-500" />;
                default: return <FaFile size={24} className="text-gray-500" />;
            }
        } else {
            switch (file.type) {
                case 'application/pdf': return <FaFilePdf size={24} className="text-red-500" />;
                case 'application/msword':
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    return <FaFileWord size={24} className="text-blue-500" />;
                case 'application/vnd.ms-excel':
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    return <FaFileExcel size={24} className="text-green-500" />;
                default: return <FaFile size={24} className="text-gray-500" />;
            }
        }
    };

    const renderFilePreview = useMemo(() => {
        return allFiles.map((file, index) => {
            const isImage = typeof file !== 'string' && file.type?.startsWith('image/');
            const fileUrl = typeof file === 'string' ? `${imgUrl}/${file}` : URL.createObjectURL(file);

            return (
                <div key={index} className="relative group border rounded p-2 bg-white dark:bg-gray-800 ">
                    <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-white dark:bg-gray-700 rounded-full p-1 text-red-600 hover:text-red-800 z-10"
                        title="Remove"
                    >
                        <Trash2 size={16} />
                    </button>

                    {isImage ? (
                        <img
                            src={fileUrl}
                            alt={`preview-${index}`}
                            className="h-32 w-32 object-cover rounded"
                            loading="lazy"
                        />
                    ) : (
                        <div className="h-32 w-32 flex flex-col items-pcenter justify-center gap-2 bg-gray-50 dark:bg-gray-700 rounded p-1">
                            {getFileIcon(file)}
                            <span className="text-xs break-words px-2 text-center text-gray-800 dark:text-white">
                                {typeof file === 'string' ? file.split('/').pop() : file.name}
                            </span>
                        </div>
                    )}
                </div>
            );
        });
    }, [allFiles]);

    return (
        <div className={`flex flex-col gap-4 ${classNameParent}`}>
            <div className="w-full">
                {label && (
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <input
                    id={name}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xlsx"
                    {...register(name)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {allFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {renderFilePreview}
                </div>
            )}
        </div>
    );
};

export default ImageGalleryInput;
