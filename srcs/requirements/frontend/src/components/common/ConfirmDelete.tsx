

import styled from 'styled-components';

const ConfirmDeleteStyle = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;


    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    z-index: 100;
    position: absolute;
    top: 0;
    left: 0;

    @media (max-width: 900px) {
    
        .confirm-delete-con {
            width: 60%;
            height: 40%;
            max-height: 300px;
            // height: 20%;
        }
    }

    @media (max-width: 400px) {
        .btns-cont {
            flex-direction: column;
        }
    } 


    `;



const ConfirmDelete = (
    { setShow, id, confirmData }: {
        setShow: any,
        id: string,
        confirmData: any,
    }) => {

    return (

        <ConfirmDeleteStyle className='bg-neutral-900  bg-opacity-70 w-full h-full top-0 left-0 '>

            <div className='flex flex-col justify-center items-center w-full h-full bg-stone-900'>
                <div className='confirm-delete-con
                flex flex-col justify-center items-center w-1/4 h-1/6 bg-white max-w-[300px] max-h-[300px] 
                 rounded-lg shadow-lg'>
                    <div className='flex flex-col justify-center items-center w-full h-full p-4'>
                        <p className='text-2xl font-semibold text-black text-center
                                '>{confirmData.title}</p>
                        <p className='text-lg font-semibold text-center opacity-50 text-black
                                '> {confirmData.message}</p>
                            {/* if now actionName is give add cancel only */}
                        <div className='btns-cont flex flex-row justify-center items-center w-full h-full'>
                            <button className=' text-black rounded-lg px-4 py-2 m-2 bg-gray-200'
                                onClick={() => setShow(false)}
                                >Cancel</button>
                            {
                                confirmData.actionName === '' ? null :
                            
                            <button className='bg-red-500 text-white rounded-lg px-4 py-2 m-2'
                                onClick={() => confirmData.confirm(id)}
                                >{confirmData.actionName}</button>
                            }
                        </div>
                    </div>
                </div>
            </div>

                              </ConfirmDeleteStyle>

    
    )
}

export default ConfirmDelete;