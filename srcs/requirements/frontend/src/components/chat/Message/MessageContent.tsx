



import styled from 'styled-components';

import Cookies from 'js-cookie';

const MessageContentStyle = styled.div`
align-self: ${props => props.sender_id === Cookies.get('id') ? 'flex-end' : 'flex-start'};
background: ${props => props.sender_id === Cookies.get('id') ? '#E9D990' : '#E7E7E7'};
color: ${props => props.sender_id === Cookies.get('id') ? '#ffff' : '#303030'};
border-radius: 20px;
padding: 10px;
max-width: 50%;
margin: 2px 0;
`;


const MessageContent = ({ content, sender_id, id }: { content: string, sender_id: string, id: string }) => {

    return (
        <MessageContentStyle sender_id={sender_id}>
            <p className='font-semibold'>{content}</p>
        </MessageContentStyle>
    );
};

export default MessageContent;