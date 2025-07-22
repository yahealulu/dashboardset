import React from 'react';
import {
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    FormGroup,
} from '@mui/material';

const permissions = [
    'c-category', 'r-category', 'u-category', 'd-category',
    'c-product', 'r-product', 'u-product', 'd-product',
    'c-banner', 'r-banner', 'u-banner', 'd-banner',
    'c-offer', 'r-offer', 'u-offer', 'd-offer',
    'c-productVariant', 'r-productVariant', 'u-productVariant', 'd-productVariant',
    'c-activity', 'r-activity', 'u-activity', 'd-activity',
    'c-rating', 'r-rating', 'u-rating', 'd-rating',
    'c-price', 'r-price', 'u-price', 'd-price',
    'c-country', 'r-country', 'u-country', 'd-country',
    'c-state', 'r-state', 'u-state', 'd-state',
    'c-about-us', 'r-about-us', 'u-about-us', 'd-about-us',
    'c-container', 'r-container', 'u-container', 'd-container',
    'c-bite', 'r-bite', 'u-bite', 'd-bite',
    'c-product_variant', 'r-product_variant', 'u-product_variant', 'd-product_variant',
];

const permissionLabels: Record<string, string> = {
    c: 'Create',
    r: 'Read',
    u: 'Update',
    d: 'Delete',
};

const groupPermissions = () => {
    const grouped: Record<string, string[]> = {};
    permissions.forEach((perm) => {
        const [, key] = perm.split('-');
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(perm);
    });
    return grouped;
};

const groupedPermissions = groupPermissions();

const PermissionsPage = ({
    selected,
    setSelected,
}: {
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
    const handleToggle = (perm: string) => {
        setSelected((prev) =>
            prev.includes(perm)
                ? prev.filter((p) => p !== perm)
                : [...prev, perm]
        );
    };

    const handleSelectAll = () => {
        setSelected([...permissions]);
    };

    const handleClearAll = () => {
        setSelected([]);
    };

    return (
        <div className="p-4">
            <Typography variant="h5" gutterBottom>
                Permissions
            </Typography>

            <div className="flex gap-2 mb-4">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSelectAll}
                >
                    Select All
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClearAll}
                >
                    Clear All
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {Object.entries(groupedPermissions).map(([group, perms]) => (
                    <div key={group} className="mb-2">
                        <Typography
                            variant="subtitle1"
                            className="font-semibold border-b border-primary mb-1"
                        >
                            {group.replace(/-/g, ' ').toUpperCase()}
                        </Typography>
                        <FormGroup row>
                            {perms.map((perm) => {
                                const [action] = perm.split('-');
                                return (
                                    <FormControlLabel
                                        key={perm}
                                        control={
                                            <Checkbox
                                                checked={selected.includes(perm)}
                                                onChange={() =>
                                                    handleToggle(perm)
                                                }
                                            />
                                        }
                                        label={permissionLabels[action] || action}
                                        className="!text-xs"
                                    />
                                );
                            })}
                        </FormGroup>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PermissionsPage;
