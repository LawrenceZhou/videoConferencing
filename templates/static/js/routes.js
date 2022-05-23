import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import OuterFrame from './components/OuterFrame';

// import more components
export default (
    <BrowserRouter>

            <Route path='/' component={OuterFrame} />

    </BrowserRouter>
);
