import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import { useAuth } from '../../components/Auth/AuthProvider';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from '../../Api/axios';
import { toast } from 'react-toastify';
import { Loader } from '../../components/UI/Loader';

const LoginCover = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(setPageTitle(t('login.pageTitle')));
    }, [dispatch, t]);

    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const user = useAuth();
    const location = useLocation();
    const RoutePath = location.state?.path || '/';

    const setLocale = (flag: string) => {
        setFlag(flag);
        dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
    };

    const [flag, setFlag] = useState(themeConfig.locale);

    const { mutate, isPending } = useMutation<any>({
        mutationFn: async (data) => {
            const res = await axios.post(`loginSuperAdmin`, data);
            return res;
        },
    });

    const submitForm = (data: any) => {
        mutate(data, {
            onSuccess(data) {
                const token = data.data.data.token;
                const permissions = data.data.data.user?.permissions || [];

                localStorage.setItem('adminToken', token);
                localStorage.setItem('permissions', JSON.stringify(permissions));

                navigate('/');
                reset();
            },
            onError(error: any) {
                toast.error(error?.response?.data?.message || 'Login failed');
            },
        });
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg-gradient.png" alt="background" className="h-full w-full object-cover" />
            </div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <img src="/assets/images/auth/coming-soon-object1.png" alt="" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                <img src="/assets/images/auth/coming-soon-object2.png" alt="" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                <img src="/assets/images/auth/coming-soon-object3.png" alt="" className="absolute right-0 top-0 h-[300px]" />
                <img src="/assets/images/auth/polygon-object.svg" alt="" className="absolute bottom-0 end-[28%]" />
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-gradient-to-tr from-primary-dark-light to-primary p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                <img src="/assets/images/auth/logo-white.svg" alt="Logo" className="w-full" />
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/login.svg" alt="Cover" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto w-10" />
                            </Link>
                            <div className="dropdown ms-auto w-max">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                    button={
                                        <>
                                            <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                                            <div className="text-base font-bold uppercase">{flag}</div>
                                            <span className="shrink-0">
                                                <IconCaretDown />
                                            </span>
                                        </>
                                    }
                                >
                                    <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                        {themeConfig.languageList.map((item: any) => (
                                            <li key={item.code}>
                                                <button
                                                    type="button"
                                                    className={`flex w-full hover:text-primary rounded-lg ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                    onClick={() => {
                                                        i18next.changeLanguage(item.code);
                                                        setLocale(item.code);
                                                    }}
                                                >
                                                    <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                    <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">{t('login.title')}</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">{t('login.description')}</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(submitForm)}>
                                <div>
                                    <label htmlFor="Email">{t('login.emailLabel')}</label>
                                    <div className="relative text-white-dark">
                                        <input {...register('email')} id="Email" type="email" placeholder={t('login.emailPlaceholder')} className="form-input ps-10 placeholder:text-white-dark" />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Password">{t('login.passwordLabel')}</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            {...register('password')}
                                            type="password"
                                            placeholder={t('login.passwordPlaceholder')}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                                        <span className="text-white-dark">{t('login.rememberMe')}</span>
                                    </label>
                                </div>

                                <button type="submit" disabled={isPending} className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    {t('login.signIn')}
                                </button>

                                {isPending && (
                                    <div className="flex justify-center mt-4">
                                        <Loader />
                                    </div>
                                )}
                            </form>

                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">{t('login.or')}</span>
                            </div>
                            <div className="text-center dark:text-white pb-5">
                                {t('login.forgot')} &nbsp;
                                <Link to="/forget-password" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    {t('login.reset')}
                                </Link>
                            </div>
                            <div className="text-center dark:text-white">
                                {t('login.noAccount')} &nbsp;
                                <Link to="/register" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    {t('login.signUp')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginCover;
