import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useTranslation } from 'react-i18next';
import axios from '../Api/axios';
import { imgUrl } from '../Api/axios';

const StatCard = ({ title, value }: { title: string; value: number | string }) => (
    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900 dark:to-yellow-800 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center transition-transform hover:scale-105 duration-300">
        <p className="text-yellow-700 dark:text-yellow-300 font-semibold text-sm uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-extrabold text-yellow-900 dark:text-yellow-100 mt-2">{value}</h3>
    </div>
);

type TopProduct = {
    product_id: number;
    product_name: { ar: string; en: string };
    country_name: string;
    image: string | null;
    total_sales: number;
};

type TopCategory = {
    id: number;
    name: { ar: string; en: string };
    country_name: string;
    total_sales: number;
};

const ProductCard = ({ product, lang }: { product: TopProduct; lang: 'ar' | 'en' }) => {
    return (
        <div className="bg-yellow-50 dark:bg-yellow-800 rounded-2xl shadow-md p-4 flex flex-col items-center text-center transition-transform hover:scale-105 duration-300">
            <div className="w-full h-32 mb-3 overflow-hidden rounded-xl bg-white dark:bg-yellow-900 flex items-center justify-center">
                {product.image ? (
                    <img
                        src={`${imgUrl}/${product.image}`}
                        alt={product.product_name[lang]}
                        className="object-contain h-full max-w-full"
                    />
                ) : (
                    <div className="text-yellow-400 text-sm">No Image</div>
                )}
            </div>
            <h4 className="text-md font-semibold text-yellow-900 dark:text-yellow-100 mb-1 line-clamp-2">
                {product.product_name[lang]}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">{product.country_name}</p>
            <p className="mt-1 text-sm font-medium text-yellow-900 dark:text-yellow-100">
                {product.total_sales}
            </p>
        </div>
    );
};

const fetchTotalOrders = async () => (await axios.get('/stats/total-orders')).data.data.total_orders;
const fetchTotalAgents = async () => (await axios.get('/stats/total-agents')).data.data.total_agents;
const fetchTotalContainers = async () => (await axios.get('/stats/total-containers')).data.data.total_containers;
const fetchTotalProducts = async () => (await axios.get('/stats/total-products')).data.data.total_products;
const fetchTotalCategories = async () => (await axios.get('/stats/total-categories')).data.data.total_categories;
const fetchTotalSales = async () => (await axios.get('/stats/total-sales')).data.data.total_sales;

type CountrySales = { country: string; total_containers: number; total_sales: string };

const fetchTopCountriesBySales = async (): Promise<CountrySales[]> => {
    const res = await axios.get('/stats/top-countries-by-sales');
    return res.data.data;
};

const fetchTopProductsByCountry = async (): Promise<TopProduct[]> => {
    const res = await axios.get('/stats/top-products-by-country');
    return res.data.data;
};

const fetchTopCategoriesBySales = async (): Promise<TopCategory[]> => {
    const res = await axios.get('/stats/topCategoriesBySales');
    return res.data.data;
};

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language === 'ar' ? 'ar' : 'en';

    const [selectedCountry, setSelectedCountry] = useState<string | 'all'>('all');

    const { data: ordersCount } = useQuery({ queryKey: ['total-orders'], queryFn: fetchTotalOrders });
    const { data: agentsCount } = useQuery({ queryKey: ['total-agents'], queryFn: fetchTotalAgents });
    const { data: containersCount } = useQuery({ queryKey: ['total-containers'], queryFn: fetchTotalContainers });
    const { data: productsCount } = useQuery({ queryKey: ['total-products'], queryFn: fetchTotalProducts });
    const { data: categoriesCount } = useQuery({ queryKey: ['total-categories'], queryFn: fetchTotalCategories });
    const { data: totalSales } = useQuery({ queryKey: ['total-sales'], queryFn: fetchTotalSales });
    const { data: topCountries } = useQuery({ queryKey: ['top-countries-by-sales'], queryFn: fetchTopCountriesBySales });
    const { data: topProductsByCountry } = useQuery({ queryKey: ['top-products-by-country'], queryFn: fetchTopProductsByCountry });
    const { data: topCategories } = useQuery({ queryKey: ['top-categories-by-sales'], queryFn: fetchTopCategoriesBySales });

    const countriesList = Array.from(new Set(topProductsByCountry?.map((p) => p.country_name) || []));
    const filteredProducts = selectedCountry === 'all'
        ? topProductsByCountry
        : topProductsByCountry?.filter((p) => p.country_name === selectedCountry);

 const chartCountries = {
    series: [
        {
            name: t('dashboard.totalContainers'),
            data: topCountries ? topCountries.map((c) => c.total_containers) : [],
        },
    ],
    options: {
        chart: {
            type: 'bar' as const,
            toolbar: { show: false },
        },
        xaxis: {
            categories: topCountries ? topCountries.map((c) => c.country) : [],
            labels: {
                style: {
                    colors: '#92400E',
                    fontWeight: 600,
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#92400E',
                    fontWeight: 600,
                },
            },
            title: {
                text: t('dashboard.totalContainers'),
                style: { color: '#92400E' },
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '50%',
            },
        },
        dataLabels: {
            enabled: true,
            style: { fontWeight: 'bold', colors: ['#92400E'] },
        },
        colors: ['#F59E0B'],
        tooltip: {
            theme: 'dark',
        },
        responsive: [{ breakpoint: 640, options: { chart: { width: 300 } } }],
    } satisfies ApexOptions,
};


   return (
        <div className="p-6 min-h-screen bg-gradient-to-br transition-colors duration-500">
            <h1 className="text-4xl font-extrabold mb-8 text-yellow-900 dark:text-yellow-200">{t('dashboard.name')}</h1>

            <div className="grid md:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title={t('dashboard.totalOrders')} value={ordersCount ?? 0} />
                <StatCard title={t('dashboard.totalAgents')} value={agentsCount ?? 0} />
                <StatCard title={t('dashboard.totalContainers')} value={containersCount ?? 0} />
                <StatCard title={t('dashboard.totalProducts')} value={productsCount ?? 0} />
                <StatCard title={t('dashboard.totalCategories')} value={categoriesCount ?? 0} />
                <StatCard title={t('dashboard.totalSales')} value={totalSales ? `$${Number(totalSales).toLocaleString()}` : '$0'} />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-yellow-900 rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold mb-5 text-yellow-900 dark:text-yellow-200 border-b border-yellow-300 dark:border-yellow-700 pb-2">
                        {t('dashboard.salesByCountryChart')}
                    </h2>
                    <ReactApexChart options={chartCountries.options} series={chartCountries.series} type="bar" height={320} />
                </div>

                <div className="bg-white dark:bg-yellow-900 rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold mb-5 text-yellow-900 dark:text-yellow-200 border-b border-yellow-300 dark:border-yellow-700 pb-2">
                        {t('dashboard.topCountriesBySales')}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-yellow-900 dark:text-yellow-300">
                            <thead>
                                <tr className="uppercase tracking-wide text-sm bg-yellow-100 dark:bg-yellow-800">
                                    <th className="py-3 px-4">{t('dashboard.country')}</th>
                                    <th className="py-3 px-4">{t('dashboard.totalContainers')}</th>
                                    <th className="py-3 px-4">{t('dashboard.totalSales')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCountries && topCountries.length > 0 ? (
                                    topCountries.map((country, i) => (
                                        <tr key={i} className="border-b border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-800 transition-colors">
                                            <td className="py-3 px-4 font-medium">{country.country}</td>
                                            <td className="py-3 px-4">{country.total_containers}</td>
                                            <td className="py-3 px-4">${Number(country.total_sales).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-yellow-500 dark:text-yellow-400">
                                            {t('dashboard.noData')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-yellow-900 rounded-2xl shadow-xl p-6">
                    <h2 className="text-xl font-semibold mb-5 text-yellow-900 dark:text-yellow-200 border-b border-yellow-300 dark:border-yellow-700 pb-2">
                        {t('dashboard.topCategoriesBySales')}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-yellow-900 dark:text-yellow-300">
                            <thead>
                                <tr className="uppercase tracking-wide text-sm bg-yellow-100 dark:bg-yellow-800">
                                    <th className="py-3 px-4">{t('dashboard.category')}</th>
                                    <th className="py-3 px-4">{t('dashboard.country')}</th>
                                    <th className="py-3 px-4">{t('dashboard.Quantity')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCategories && topCategories.length > 0 ? (
                                    topCategories.map((category, i) => (
                                        <tr key={i} className="border-b border-yellow-300 dark:border-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-800 transition-colors">
                                            <td className="py-3 px-4 font-medium">{category.name[lang]}</td>
                                            <td className="py-3 px-4">{category.country_name}</td>
                                            <td className="py-3 px-4">{Number(category.total_sales).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-yellow-500 dark:text-yellow-400">
                                            {t('dashboard.noData')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-yellow-900 rounded-2xl shadow-xl p-6 overflow-hidden max-h-[600px]">
                    <div className="flex items-center justify-between mb-5 border-b border-yellow-300 dark:border-yellow-700 pb-2 sticky top-0 bg-white dark:bg-yellow-900 z-10">
                        <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-200">{t('dashboard.topProductsByCountry')}</h2>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-200 rounded px-3 py-1"
                        >
                            <option value="all">{t('dashboard.allCountries')}</option>
                            {countriesList.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-y-auto max-h-[500px] pr-1">
                        {filteredProducts && filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.product_id} product={product} lang={lang} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-yellow-600 dark:text-yellow-300">No Data</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
