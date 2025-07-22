import axios, { imgUrl } from './axios';
import { useMutation } from '@tanstack/react-query';

export const generateFileExcel = (route: string, isOneData: boolean) => {
    const mutate = useMutation({
        mutationFn: async () => {
            const response = await axios.get(route);
            const downloadUrl = isOneData ? `${imgUrl}${response.data?.download_url}` : `${imgUrl}${response.data.data?.download_url}`;
            console.log(downloadUrl);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '';
            link.target = '_self';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return response.data;
        },
        onSuccess: (data) => {},
        onError: (error) => {
            console.error('File generation failed', error);
        },
    });
    return mutate;
};
