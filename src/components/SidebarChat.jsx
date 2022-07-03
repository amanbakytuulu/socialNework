import React, { useState } from 'react';
import styled from 'styled-components';
import SidebarChatRow from './SidebarChatRow';
import { useSelector } from 'react-redux';
import { firestore } from '../firebase';
import { NavLink } from 'react-router-dom';

function SidebarChat() {
    const [show, setShow] = useState(true);
    const { currentUser, users } = useSelector((state) => state.users);

    let colors = ["#10d876", "#FE9431", "#E50202"];
    return (
        <>
            <SidebarChats show={show}>
                <ToggleButton show={show} onClick={() => setShow(!show)}>{show ? '→' : '←'}</ToggleButton>
                <StyledWrap>
                    <Title>Контакты</Title>
                    {
                        currentUser?.currentUser.chatUsers.length !== 0
                        &&
                        (
                            currentUser?.currentUser.chatUsers.filter((user) => {
                                if (currentUser?.currentUser.isBlocked.length !== 0) {
                                    for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                        if (user.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                            return user
                                        }
                                    }
                                } else {
                                    return user
                                }
                            }).map((user) => {
                                return (
                                    <NavLink to={`/chat/${user.uid}`}>
                                        <SidebarChatRow profile={user.photoURL}
                                            name={user.firstName}
                                            newMessage={currentUser?.currentUser.newMessage.includes(user.uid)} />
                                    </NavLink>
                                )
                            })
                        )

                    }
                </StyledWrap>
            </SidebarChats>
        </>
    )
}

export default SidebarChat

const SidebarChats = styled.div`
    font-family: var(--body-font), sans-serif;
    z-index:99;
    position: fixed;
    top: 103px;
    right: ${props => props.show ? '0px' : '-240px'};
    background: var(--container-color);
    border-radius: 10px;
    padding: 15px 20px;
    max-width: 240px;
    width: 100%;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    box-shadow: -3px 0px 15px rgba(99, 98, 98, 0.1);
    transition:all .3s linear;

    &:hover > button{
        opacity:1;
        transition:all 0.34s linear;
    }

`;

const ToggleButton = styled.button`
    position:absolute;
    font-size:23px;
    padding-bottom:5px;
    width:45px;
    height:50px;
    border-top-left-radius:50px;
    border-bottom-left-radius: 50px;
    outline:none;
    border:none;
    left:-45px;
    top:40px;
    color: white;
    background-color: var(--button-color);
    cursor:pointer;
    opacity:${props => props.show ? '0' : '1'};

`;

const StyledWrap = styled.div`
    overflow-x: visible;
    word-break: break-all;
    overflow-y: scroll;
    height: 100vh;
    width: 112%;
`;

const Title = styled.h4`
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 0.7rem;
    font-weight: 500;
    color: #adb5bd;
    text-transform: uppercase;
`;
