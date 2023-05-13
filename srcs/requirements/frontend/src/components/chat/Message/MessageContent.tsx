



import styled from 'styled-components';

import Cookies from 'js-cookie';
import { CiTrash } from 'react-icons/ci';
import { useState } from 'react';
import axios from 'axios';
import ConfirmDelete from '../../common/ConfirmDelete';

const MessageStyle = styled.div`

    background: ${props => props.sender_id === Cookies.get('id') ? '#E9D990' : '#E7E7E7'};
    color: ${props => props.sender_id === Cookies.get('id') ? '#ffff' : '#303030'};
    border-radius: 20px;
    padding: 10px;
    max-width: 100%;
    width: auto;
    margin: 2px 0;
    display: flex;
    `;


const MessageContentStyle = styled.div`
align-self: ${props => props.sender_id === Cookies.get('id') ? 'flex-end' : 'flex-start'};
max-width: 50%;
margin: 2px 0;
display: flex;


.delete__icon {
    opacity: 0;
    width: 0;
    height: 0;     
}
&:hover {
    .delete__icon {
        transition: all 0.3s ease-in-out;
        opacity: 1;
        width: 20px;
        height: 20px;
        font-size: 1.2rem;

    }
}
`;

const MessageContentWrapper = styled.div`
    display: flex;

    flex-direction: ${props => props.sender_id === Cookies.get('id') ? 'row-reverse' : 'row'};
    width: auto;
    
`;


const DeletIconStyle = styled.div`

    margin: ${props => props.sender_id === Cookies.get('id') ? '0 10px 0 0px' : '0 0px 0 10px'};
    align-self: center;
    `;




const MessageContent = ({ content, sender_id, id, chatRoomId, setState }: { content: string, sender_id: string, id: string, chatRoomId: string, setState: any }) => {
    let confirmData = {
        show: false,
        title: "Delete Message",
        message: "Are you sure you want to delete this message?",
        actionName: "Delete",
        confirm: () => handleDelete(id),
    }

    const [showDeleteModal, setShowDeleteModal] = useState(confirmData);


    const handleDelete = (id: string) => {
        console.log("im trying to delete message with id: ", id);
        console.log("im trying to delete message with chatRoomId: ", chatRoomId);
        axios.delete(
            `http://localhost:3000/api/v1/chatrooms/private/${chatRoomId}/message/${id}`,
            { withCredentials: true }
        ).then(res => {
            console.log(res);
            if (res.status === 200) {
                setShowDeleteModal({ ...showDeleteModal, show: false });
                setState((prevState: any) => ({
                    ...prevState,
                    messages: prevState.messages.filter((message: any) => message.id !== id)
                }));
            }
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div className='flex flex-col'>
            <MessageContentStyle sender_id={sender_id} id={id}>
                <MessageContentWrapper sender_id={sender_id} id={id} >
                    <MessageStyle sender_id={sender_id} id={id} >
                        <p className='font-semibold'>{content}</p>
                    </MessageStyle>
                    {
                        sender_id === Cookies.get('id') &&

                        <DeletIconStyle sender_id={sender_id} id={id} onClick={() => setShowDeleteModal({ ...showDeleteModal, show: true })}>
                            <CiTrash className="delete__icon text-gray-400 cursor-pointer  hover:text-red-500 transition ease-in-out duration-150" />
                        </DeletIconStyle>
                    }
                </MessageContentWrapper>
            </MessageContentStyle >
            {
                showDeleteModal.show && <ConfirmDelete setShow={setShowDeleteModal} id={id} confirmData={confirmData} />
            }

        </div>

    );

};

export default MessageContent;