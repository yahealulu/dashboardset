import { lazy } from 'react';

const Index = lazy(() => import('../pages/Index'));
const LoginCover = lazy(() => import('../pages/Authentication/LoginCover'));
const RegisterCover = lazy(() => import('../pages/Authentication/RegisterCover'));
const RecoverIdCover = lazy(() => import('../pages/Authentication/RecoverIdCover'));
const Customers = lazy(() => import('../pages/Customers/Customers'));
const Agents = lazy(() => import('../pages/Customers/Agents'));

const Profile = lazy(() => import('../pages/Customers/Profile'));
const AccountSettings = lazy(() => import('../pages/Account/AccountSetting'));
const AccountProfile = lazy(() => import('../pages/Account/Profile'));
const HOMEPage = lazy(() => import('../pages/Home'));
const Bites = lazy(() => import('../pages/Bites/Bites'));
const AddBites = lazy(() => import('../pages/Bites/AddBites'));
const Activities = lazy(() => import('../pages/Activities/Activities'));
const AddActivities = lazy(() => import('../pages/Activities/AddActivities'));
const AboutUs = lazy(() => import('../pages/AboutUs/AboutUs'));
const AddAboutUs = lazy(() => import('../pages/AboutUs/AddAboutUs'));
const Banners = lazy(() => import('../pages/Banners/Banners'));
const Category = lazy(() => import('../pages/Category/Category'));
const AddCategory = lazy(() => import('../pages/Category/AddCategory'));
const EditCategory = lazy(() => import('../pages/Category/EditCategory'));
const Country = lazy(() => import('../pages/Country/Country'));
const AddCountry = lazy(() => import('../pages/Country/AddCountry'));
const State = lazy(() => import('../pages/State/State'));
const AddProducts = lazy(() => import('../pages/Products/AddProducts'));
const Products = lazy(() => import('../pages/Products/Products'));
const Item = lazy(() => import('../pages/Products/Item/Item'));
const AddItem = lazy(() => import('../pages/Products/Item/AddItem'));
const AddAdmins = lazy(() => import('../pages/Admins/AddAdmins'));
const Admins = lazy(() => import('../pages/Admins/Admins'));
const AddAgent = lazy(() => import('../pages/Agents/AddAgent'));
const AprrovedAgnts = lazy(() => import('../pages/Agents/AprrovedAgnts'));

const AddOffers = lazy(() => import('../pages/Offers/AddOffers'));
const Offers = lazy(() => import('../pages/Offers/Offers'));
const Rating = lazy(() => import('../pages/Rating/Rating'));
const AddRating = lazy(() => import('../pages/Rating/AddRating'));
const Prices = lazy(() => import('../pages/Prices/Prices'));
const Orders = lazy(() => import('../pages/Orders/Orders'));
const OrderInfo = lazy(() => import('../pages/Orders/OrderInfo'));


const Sessions = lazy(() => import('../pages/Sessions/Sessions'));



const routes = [
    // dashboard
    {
        path: '/logIn',
        element: <LoginCover />,
        layout: 'blank',
    },
    {
        path: '/register',
        element: <RegisterCover />,
        layout: 'blank',
    },
    {
        path: '/forget-password',
        element: <RecoverIdCover />,
        layout: 'blank',
    },
    {
        path: '/',
        element: <Index />,
        layout: 'default',
    },
    {
        path: '/users/admins',
        element: <Admins />,
        layout: '',
    },
    {
        path: '/accounts/prices',
        element: <Prices />,
        layout: '',
    },
     {
        path: '/shipments/order',
        element: <Orders />,
        layout: '',
    },
     {
        path: '/shipments/orders/:id',
        element: <OrderInfo />,
        layout: '',
    },
    {
        path: '/accounts/rating',
        element: <Rating />,
        layout: '',
    },
    {
        path: '/accounts/rating/add/:type/:rateable_id',
        element: <AddRating />,
        layout: '',
    },
    {
        path: '/company-industry/offer',
        element: <Offers />,
        layout: '',
    },
    {
        path: '/company-industry/offer/:itemId',
        element: <AddOffers />,
        layout: '',
    },
    {
        path: '/company-industry/offer/:id',
        element: <AddOffers />,
        layout: '',
    },
    {
        path: '/users/aprrovedagnts',
        element: <AprrovedAgnts />,
        layout: '',
    },
    {
        path: '/users/aprrovedagnts/add',
        element: <AddAgent />,
        layout: '',
    },
    {
        path: '/users/aprrovedagnts/:id',
        element: <AddAgent />,
        layout: '',
    },

    {
        path: '/users/admins/add',
        element: <AddAdmins />,
        layout: '',
    },
    {
        path: '/users/admins/:id',
        element: <AddAdmins />,
        layout: '',
    },
    {
        path: '/users/customers',
        element: <Customers />,
        layout: '',
    },
    {
        path: '/company-industry/product',
        element: <Products />,
        layout: '',
    },
    {
        path: '/company-industry/product/item/:id',
        element: <Item />,
        layout: '',
    },
    {
        path: '/company-industry/product/item/:id/add',
        element: <AddItem />,
        layout: '',
    },
    {
        path: '/company-industry/product/item/:id/:itemId',
        element: <AddItem />,
        layout: '',
    },
    {
        path: '/company-industry/product/add',
        element: <AddProducts />,
        layout: '',
    },
    {
        path: '/company-industry/product/:id',
        element: <AddProducts />,
        layout: '',
    },
    {
        path: '/country',
        element: <Country />,
        layout: '',
    },
    {
        path: '/country/add',
        element: <AddCountry />,
        layout: '',
    },
    {
        path: '/country/:id',
        element: <AddCountry />,
        layout: '',
    },
    {
        path: '/state',
        element: <State />,
        layout: '',
    },

    {
        path: '/company-info/activity',
        element: <Activities />,
        layout: '',
    },
    {
        path: '/company-info/activity/add',
        element: <AddActivities />,
        layout: '',
    },
    {
        path: '/company-info/activity/:id',
        element: <AddActivities />,
        layout: '',
    },
    {
        path: '/company-industry/bite',
        element: <Bites />,
        layout: '',
    },
        {
        path: '/company-industry/bite/add',
        element: <AddBites />,
        layout: '',
    },
    {
        path: '/company-industry/bite/:id',
        element: <AddBites />,
        layout: '',
    },
    {
        path: '/company-industry/category',
        element: <Category />,
        layout: '',
    },
    {
        path: '/company-industry/category/add',
        element: <AddCategory />,
        layout: '',
    },
    {
        path: '/company-industry/category/:id',
        element: <AddCategory />,
        layout: '',
    },
    {
        path: '/company-industry/category/edit/:id',
        element: <EditCategory />,
        layout: '',
    },
    {
        path: '/company-info/about-us',
        element: <AboutUs />,
        layout: '',
    },
    {
        path: '/company-info/about-us/:id',
        element: <AddAboutUs />,
        layout: '',
    },
    {
        path: '/company-info/about-us/add',
        element: <AddAboutUs />,
        layout: '',
    },
    {
        path: '/company-info/banner',
        element: <Banners />,
        layout: '',
    },
    {
        path: '/users/agents',
        element: <Agents />,
        layout: '',
    },
    {
        path: '/customers/profile',
        element: <Profile />,
        layout: '',
    },
    {
        path: '/account/profile',
        element: <AccountProfile />,
        layout: '',
    },
    {
        path: '/account/profileSettings',
        element: <AccountSettings />,
        layout: '',
    },
    {
        path: '/accounts/sessions',
        element: <Sessions />,
        layout: '',
    },
        {
        path: '/accounts/visitors',
        element: <Sessions />,
        layout: '',
    },
    // main site
    {
        path: '/home',
        element: <HOMEPage />,
        layout: '',
    },
];

export { routes };
