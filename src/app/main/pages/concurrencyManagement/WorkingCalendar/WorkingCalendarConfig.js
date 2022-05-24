import React from 'react';

export const  WorkingCalendarConfig = {
  
    routes  : [
        {
            path     : '/workingCalendar',
            component: React.lazy(() => import('./WorkingCalendarForm'))
        }
    ]
};