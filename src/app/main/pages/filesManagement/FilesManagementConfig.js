import React from 'react';

const FilesManagementConfig = {
    settings: {
        layout: {

        }
    },
    routes  : [
        {
            path     : '/fileManager',
            component: React.lazy(() => import('./fileManager/FileManager'))
        }
    ]
}

export default FilesManagementConfig;



