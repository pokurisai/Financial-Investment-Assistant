import React from 'react';
import { toast } from 'react-toastify';
import { ToastContent } from './toastcontent';

//const closeInteval = 2000;

const successToast = message => {
    debugger;
    toast(<ToastContent type='SUCCESS' message={message} />, {
        className: 'bg-green-extra-light',
        autoClose: 2000,
        closeButton: true,
        pauseOnHover: true
    });
}

const errorToast = message => {
    toast(<ToastContent type='ERROR' message={message} />, {
        className: 'bg-red-light',
        autoClose: 2000,
        closeButton: true
    });
}

const warningToast = message => {
    toast(<ToastContent type='WARN' message={message} />, {
        className: 'bg-green-extra-light',
        autoClose: 2000,
        closeButton: true
    });
}

const infoToast = message => {
    toast(<ToastContent type='INFO' message={message} />, {
        className: 'bg-green-extra-light',
        autoClose: 2000,
        closeButton: true
    });
}

export {
    successToast,
    errorToast,
    warningToast,
    infoToast
};
