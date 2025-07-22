import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { imgUrl } from '../../Api/axios';
import IconTrashLines from '../../components/Icon/IconTrashLines';
import IconEdit from '../../components/Icon/IconEdit';
import DialougRemove from '../../components/UI/DialougRemove';
import { Loader } from '../../components/UI/Loader';
import { useTranslation } from 'react-i18next';

interface AboutUsData {
    id: number;
    description_translations: {
        ar: string;
        en: string;
        fr: string;
        da: string;
        de: string;
        fa: string;
        ru: string;
        tr: string;
        zh: string;
    };
    gallery: string[];
    video_url: string[];
    created_at: string;
    updated_at: string;
}

const AboutUs = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openDelete, setOpenDelete] = useState(false);
    const [ID, setId] = useState<number | null>(null);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-about-us'],
        queryFn: async () => {
            const { data } = await axios.get('/about-us');
            return data;
        },
    });

    const aboutUsData: AboutUsData = data?.data;
    const { description_translations, gallery, video_url, id } = aboutUsData || {};

    return (
        <>
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl">{t('aboutUs.title')}</h2>
                <div className="flex gap-2 items-center">
                    <button type="button" className="btn btn-primary" onClick={() => navigate('add')}>
                        {t('aboutUs.add')}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="mb-6 mt-4">
                        {data?.data && (
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold mb-2">{t('aboutUs.descriptions')}</h2>
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        type="button"
                                        className="flex hover:text-danger"
                                        onClick={() => {
                                            setOpenDelete(true);
                                            setId(id!);
                                        }}
                                    >
                                        <IconTrashLines />
                                    </button>
                                    <span
                                        className="flex hover:text-info"
                                        onClick={() => {
                                            navigate(`/aboutUs/${id}`);
                                        }}
                                    >
                                        <IconEdit className="w-4.5 h-4.5" />
                                    </span>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {description_translations &&
                                Object.entries(description_translations).map(([lang, description]) => (
                                    <div key={lang} className="p-4 border rounded-lg shadow-md">
                                        <h3 className="text-lg font-medium capitalize">{lang}</h3>
                                        <p>{description}</p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {gallery && gallery.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">{t('aboutUs.gallery')}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {gallery.map((image, index) => (
                                    <div key={index} className="p-2">
                                        <img src={`${imgUrl}/${image}`} alt={`${t('aboutUs.galleryImage')} ${index + 1}`} className="w-full h-auto rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {video_url && video_url.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-2">{t('aboutUs.videoLinks')}</h2>
                            <ul className="space-y-4">
                                {video_url.map((url, index) => {
                                    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
                                    let videoId = '';
                                    if (url.includes('watch?v=')) {
                                        videoId = url.split('watch?v=')[1].split('&')[0];
                                    } else if (url.includes('youtu.be/')) {
                                        videoId = url.split('youtu.be/')[1].split('?')[0];
                                    }

                                    return (
                                        <li key={index} className="flex flex-col space-y-2">
                                            {isYouTube ? (
                                                <div className="w-full aspect-video">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        title={`${t('aboutUs.youtubeVideo')} ${index + 1}`}
                                                        className="w-full h-full rounded-lg"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            ) : (
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    {url}
                                                </a>
                                            )}
                                            {!isYouTube && <span className="text-sm text-gray-500">{t('aboutUs.video')} {index + 1}</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </>
            )}

            <DialougRemove apiPath="/about-us" id={id} open={openDelete} setOpen={setOpenDelete} refetch={refetch} />
        </>
    );
};

export default AboutUs;
