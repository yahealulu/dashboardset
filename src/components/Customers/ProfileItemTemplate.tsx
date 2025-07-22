import React, { ReactElement } from 'react';

type propsType = { title: string; info: string };

const ProfileItemTemplate = ({ title, info, children }: React.PropsWithChildren<propsType>) => {
    return (
        <div className="flex flex-col ">
            <div className="flex flex-row items-start gap-2 mb-1">
                {children}
                <div className="flex flex-col">
                    <span className="font-semibold">{title}</span>
                    <span className="">{info}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileItemTemplate;
