import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { ReactElement, useTransition } from 'react';
import IconEdit from '../Icon/IconEdit';
import IconEye from '../Icon/IconEye';
import IconTrashLines from '../Icon/IconTrashLines';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { arSA, bgBG } from '@mui/material/locale';
import { bgBG as pickersBgBG } from '@mui/x-date-pickers/locales';
import { bgBG as coreBgBG } from '@mui/material/locale';
import { end } from '@popperjs/core';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { IRootState } from '../../store';

const CustomersTable = ({ users, editUser, deleteUser }: { users: any; editUser: (user: any) => void; deleteUser: (user: any) => void }) => {
    const navigate = useNavigate();
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
        phone: true,
        role: true,
        email: true,
        location: true,
        actions: true,
    });
    const theme = createTheme(
        {
            palette: {
                primary: { main: '#1976d2' },
            },
        },
        arSA, // x-data-grid translations
        pickersBgBG, // x-date-pickers translations
        coreBgBG // core translations
    );
    const { t } = useTranslation();

    return (
        // <ThemeProvider theme={theme}>
        <div className="w-full overflow-x-auto">
            <DataGrid
                checkboxSelection
                disableRowSelectionOnClick
                // columnVisibilityModel={columnVisibilityModel}
                columns={[
                    // { field: 'id', width: 60, hideable: true },
                    {
                        field: 'name',
                        headerName: 'Name',
                        width: 180,
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                        renderCell: (params) => (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={`/assets/images/${params.row.path}`} // Access the `img` field from the row data
                                    alt={params.row.name} // Use the name as the alt text for the image
                                    style={{
                                        width: 30,
                                        height: 30,
                                        marginRight: 10,
                                        borderRadius: '50%',
                                    }} // Optional styling
                                    className="object-cover"
                                />
                                {params.row.name}
                            </div>
                        ),
                    },
                    {
                        field: 'phone',
                        headerName: 'Phone',
                        width: 180,
                        editable: false,
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                    },
                    {
                        field: 'role',
                        headerName: 'Role',
                        width: 140,
                        editable: false,
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                    },
                    {
                        field: 'email',
                        headerName: 'Email',
                        width: 180,
                        editable: false,
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                    },
                    {
                        field: 'location',
                        headerName: 'Location',
                        width: 140,
                        editable: false,
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,
                    },
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        width: 180,
                        editable: false,
                        headerAlign: 'center',
                        align: 'center',
                        flex: 1,

                        renderCell: (params) => {
                            return (
                                <div className="flex flex-row h-full gap-4 items-center justify-center w-max mx-auto">
                                    <span
                                        className="flex hover:text-info"
                                        onClick={() => {
                                            console.log(params.row);
                                            event?.stopPropagation();
                                            editUser(params.row);
                                            // console.log(params.row);
                                        }}
                                    >
                                        <IconEdit className="w-4.5 h-4.5" />
                                    </span>
                                    <span
                                        onClick={() => {
                                            navigate('/customers/profile', { state: params.row });
                                        }}
                                    >
                                        <IconEye />
                                    </span>
                                    {/* <NavLink to="" className="flex"> */}
                                    <button
                                        type="button"
                                        className="flex hover:text-danger"
                                        onClick={(e) => {
                                            deleteUser(params.row.id);
                                        }}
                                    >
                                        <IconTrashLines />
                                    </button>
                                    {/* </NavLink> */}
                                </div>
                            );
                        },
                    },
                ]}
                rows={users}
                // disableColumnSelector
                sx={{
                    minWidth: '980px',
                    bgcolor: themeConfig.theme === 'dark' ? 'rgb(59 ,63, 92, / 0.4)' : '',
                    color: themeConfig.theme === 'dark' ? '#d0d2d6' : '',
                    border: 'none',
                    '& .MuiDataGrid-columnHeaders': {
                        bgcolor: themeConfig.theme === 'dark' ? 'rgb(59 ,63, 92, / 0.4)' : '', // Change this to your desired color
                        color: themeConfig.theme === 'dark' ? '#346CDB' : '', // Change text color if needed
                    },
                    '& .MuiDataGrid-cell': {
                        // Optional: Customize cell styles if needed
                        bgcolor: themeConfig.theme === 'dark' ? 'rgb(59 ,63, 92, / 0.4)' : '',
                    },
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
                // componentsProps={{
                //     columnHeaders: {
                //         style: {
                //             backgroundColor: 'rgb(59 ,63, 92, / 0.4)', // Change this to your desired color
                //             color: '#fff', // Change text color if needed
                //         },
                //     },
                // }}
            />
        </div>
        // </ThemeProvider>
    );
};

export default CustomersTable;
