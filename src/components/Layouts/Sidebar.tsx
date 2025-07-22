import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect, useMemo } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconUser from '../Icon/IconUser';
import { HomeIcon } from 'lucide-react';
import logoLight from '../../assets/Icons/logo_black_and_gold.png';
import logoDark from '../../assets/Icons/logo_white_and_gold.png';

const menuItems = [
    {
        label:'DashBoard',
        icon: <HomeIcon className="shrink-0" />,
        path: '/',
        code: 'r-session',
        subItems: [],
    },
    {
        label: 'Accounts',
        icon: <IconUser className="shrink-0" />,
        path: '',
        code: '',
        subItems: [
            { label: 'Visitors', path: '/accounts/visitors', code: 'r-session' },
            { label: 'Sessions', path: '/accounts/sessions', code: 'r-session' },
            { label: 'Prices', path: '/accounts/prices', code: 'r-price' },
            { label: 'Ratings', path: '/accounts/rating', code: 'r-rating' },
            { label: 'Address', path: '/accounts/address', code: 'r-address' },
        ],
    },
    {
        label: 'Company Industry',
        icon: <IconUser className="shrink-0" />,
        path: '/company-industry',
        code: '',
        subItems: [
            { label: 'Categories', path: '/company-industry/category', code: 'r-category' },
            { label: 'Products', path: '/company-industry/product', code: 'r-product' },
            { label: 'Offers', path: '/company-industry/offer', code: 'r-offer' },
            { label: 'Bites', path: '/company-industry/bite', code: 'r-bite' },
            { label: 'Promotional Material', path: '/company-industry/promotional-material', code: 'r-promotionalMaterial' },
        ],
    },
    {
        label: 'Shipments',
        icon: <IconUser className="shrink-0" />,
        path: '',
        code: '',
        subItems: [
            { label: 'Order', path: '/shipments/order', code: 'r-banner' },
            { label: 'Delivery Method', path: '/shipments/delivery-method', code: 'r-activity' },
        ],
    },
    {
        label: 'Company Info',
        icon: <IconUser className="shrink-0" />,
        path: '',
        code: '',
        subItems: [
            { label: 'Banner', path: '/company-info/banner', code: 'r-banner' },
            { label: 'Activities', path: '/company-info/activity', code: 'r-activity' },
            { label: 'Partners', path: '/company-info/partner', code: 'r-partner' },
            { label: 'Contact Us', path: '/company-info/contact-us', code: 'r-ContactUs' },
            { label: 'Privacy Policy', path: '/company-info/privacy-policy', code: 'r-PrivacyPolicy' },
            { label: 'Advertisement', path: '/company-info/advertisement', code: 'r-advertisement' },
            { label: 'About Us', path: '/company-info/about-us', code: 'r-about-us' },
            { label: 'App Version', path: '/company-info/App_Version', code: 'r-App_Version' },
        ],
    },
    {
        label: 'Users',
        icon: <IconUser className="shrink-0" />,
        path: '',
        code: '',
        subItems: [
            { label: 'Admin', path: '/users/admins', code: 'r-banner' },
            { label: 'Agent', path: '/users/aprrovedagnts', code: 'r-activity' },
            { label: 'Customers', path: '/users/customers', code: 'r-activity' },
        ],
    },
];

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState('');
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const currentTheme = useMemo(() => {
        return localStorage.getItem('theme') || 'light';
    }, []);

    const permissions = useMemo(() => {
        try {
            const raw = localStorage.getItem('permissions');
            const parsed = JSON.parse(raw || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, []);

    const filteredMenus = useMemo(() => {
        return menuItems
            .map((item) => {
                const hasPermission = permissions.includes(item.code);
                const filteredSub = item.subItems?.filter((sub) => permissions.includes(sub.code)) || [];

                if (!hasPermission && filteredSub.length === 0) return null;

                return {
                    ...item,
                    subItems: filteredSub,
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    }, [permissions]);

    const toggleMenu = (label: string) => {
        setCurrentMenu((prev) => (prev === label ? '' : label));
    };

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center">
                            <img src={currentTheme === 'dark' ? logoDark : logoLight} alt="Logo" className="h-10" />{' '}
                        </NavLink>
                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)]">
                        <ul className="space-y-0.5 p-4 py-0">
                            {filteredMenus.map((item, idx) => (
                                <li key={idx} className="menu nav-item">
                                    {item.subItems.length > 0 ? (
                                        <>
                                            <button type="button" className={`nav-link group w-full ${currentMenu === item.label ? 'active' : ''}`} onClick={() => toggleMenu(item.label)}>
                                                <div className="flex items-center">
                                                    {item.icon}
                                                    <span className="pl-3 dark:text-[#506690] group-hover:text-white-dark">{t(`common.${item.label}`)}</span>
                                                </div>
                                                <div className={currentMenu !== item.label ? 'rotate-[-90deg]' : ''}>
                                                    <IconCaretDown />
                                                </div>
                                            </button>
                                            <AnimateHeight duration={300} height={currentMenu === item.label ? 'auto' : 0}>
                                                <ul className="sub-menu text-gray-500">
                                                    {item.subItems.map((sub, i) => (
                                                        <li key={i}>
                                                            <NavLink to={sub.path}>{t(`common.${sub.label}`)}</NavLink>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AnimateHeight>
                                        </>
                                    ) : (
                                        <NavLink to={item.path} className="nav-link group">
                                            <div className="flex items-center">
                                                {item.icon}
                                                <span className="pl-3 dark:text-[#506690] group-hover:text-white-dark">{t(`common.${item.label}`)}</span>
                                            </div>
                                        </NavLink>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
