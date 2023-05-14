import { useState, useEffect } from 'react';
const ConfirmDelete = (
    { setShow, id, confirmData }: {
        setShow: any,
        id: string,
        confirmData: any,
    }) => {

    return (

        <div className='flex flex-col absolute  w-full h-full
                 bg-neutral-900 bg-opacity-70 z-10 w-full h-full top-0 left-0 justify-center items-center 
                '>
            <div className='flex flex-col justify-center items-center w-full h-full'>
                <div className='flex flex-col justify-center items-center w-1/4 h-1/4 bg-[#D9D9D9] rounded-lg'>
                    <div className='flex flex-col justify-center items-center w-full h-full p-4'>
                        <p className='text-2xl font-semibold 
                                '>{confirmData.title}</p>
                        <p className='text-lg font-semibold text-center opacity-50
                                '> {confirmData.message}</p>
                        <div className='flex flex-row justify-center items-center w-full h-full'>
                            <button className=' text-white rounded-lg px-4 py-2 m-2 bg-neutral-900'
                                onClick={() => setShow(false)}
                            >Cancel</button>
                            <button className='bg-red-500 text-white rounded-lg px-4 py-2 m-2'
                                onClick={() => confirmData.confirm(id)}
                            >{confirmData.actionName}</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ConfirmDelete;