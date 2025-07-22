import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserGridCart = ({ contact, editUser, deleteUser }: { contact: any; editUser: (user: any) => void; deleteUser: (user: any) => void }) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative" key={contact.id}>
            <div className="bg-white dark:bg-[#1c232f] rounded-md overflow-hidden text-center shadow relative">
                <div
                    className="bg-white/40 rounded-t-md bg-center bg-cover p-6 pb-0 bg-"
                    style={{
                        backgroundImage: `url('/assets/images/notification-bg.png')`,
                        backgroundRepeat: 'no-repeat',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <img className="object-contain w-4/5 max-h-40 mx-auto" src={`/assets/images/${contact.path}`} alt="contact_image" />
                </div>
                <div className="px-6 pb-24 -mt-10 relative">
                    <div className="shadow-md bg-white dark:bg-gray-900 rounded-md px-2 py-4">
                        <div className="text-xl">{contact.name}</div>
                        <div className="text-white-dark">{contact.role}</div>
                        <div className="flex items-center justify-between flex-wrap mt-6 gap-3">
                            <div className="flex-auto">
                                <div className="text-info">{contact.products}</div>
                                <div>products</div>
                            </div>
                            <div className="flex-auto">
                                <div className="text-info">{contact.orders}</div>
                                <div>orders</div>
                            </div>
                            <div className="flex-auto">
                                <div className="text-info">{contact.sales}</div>
                                <div>sales</div>
                            </div>
                        </div>
                        {/* <div className="mt-4">
                                                <ul className="flex space-x-4 rtl:space-x-reverse items-center justify-center">
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconFacebook />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconInstagram />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconLinkedin />
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button type="button" className="btn btn-outline-primary p-0 h-7 w-7 rounded-full">
                                                            <IconTwitter />
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div> */}
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right">
                        <div className="flex items-center">
                            <div className="flex-none ltr:mr-2 rtl:ml-2">Email :</div>
                            <div className="truncate text-white-dark">{contact.email}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-none ltr:mr-2 rtl:ml-2">Phone :</div>
                            <div className="text-white-dark">{contact.phone}</div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex-none ltr:mr-2 rtl:ml-2">Address :</div>
                            <div className="text-white-dark">{contact.location}</div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-4 absolute bottom-0 w-full ltr:left-0 rtl:right-0 p-6">
                    <button
                        type="button"
                        className="btn btn-outline-primary w-1/2"
                        onClick={() => {
                            console.log(contact);
                            editUser(contact);
                        }}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-primary w-1/2"
                        onClick={() => {
                            navigate('/customers/profile', { state: contact });
                        }}
                    >
                        View
                    </button>
                    <button type="button" className="btn btn-outline-danger w-1/2" onClick={() => deleteUser(contact.id)}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserGridCart;
