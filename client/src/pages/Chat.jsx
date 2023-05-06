import React, { useContext, useEffect, useState } from 'react'
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import { UserContext } from '../UserContext.jsx';

export default function Chat() {

    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserID] = useState(null);
    const { username, id } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]); 

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        if ('online' in messageData) {
            showOnlinePeople(messageData.online)
        }
        else{
            console.log({messageData});
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        ws.send(JSON.stringify({
            message: {
                recepient: selectedUserId,
                text: newMessageText,
            }
        }));

        setNewMessageText('');
        setMessages(prev => ([...prev, {text: newMessageText, isOur: true}]))
    }

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        });
        setOnlinePeople(people);
        console.log(people);
    }

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4040');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
    }, []);

    const onlinePeopleExclOurUser = { ...onlinePeople };
    delete onlinePeopleExclOurUser[id];


    return (
        <div className='flex h-screen'>
            <div className="bg-white w-1/3">

                <Logo />

                {Object.keys(onlinePeopleExclOurUser).map(userId => (
                    <div
                        key={userId}
                        onClick={() => { setSelectedUserID(userId); console.log(userId) }}
                        className={'border-b border-gray-100 flex items-center gap-2 cursor-pointer ' + (userId === selectedUserId ? 'bg-blue-50' : '')}>
                        {userId === selectedUserId && (
                            <div className='w-1 bg-blue-500 h-12 rounded-r-md'> </div>
                        )}

                        <div className='flex gap-2 py-2 pl-4 items-center'>
                            <Avatar userId={userId} username={onlinePeople[userId]} />
                            <span>{onlinePeople[userId]}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className=" flex flex-col bg-blue-50 w-2/3 p-2">
                <div className='flex-grow'>
                    {!selectedUserId && (
                        <div className='flex items-center justify-center h-full text-gray-400'>&larr; Select a person from sidebar</div>
                    )}

                    {!!selectedUserId && (
                        <div>
                            {messages.map(message => (
                                <div>
                                    {message.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!!selectedUserId && (
                    <form className='flex gap-2' onSubmit={sendMessage}>
                        <input
                            value={newMessageText}
                            onChange={(e) => {
                                setNewMessageText(e.target.value);
                            }}
                            type="text"
                            placeholder='Type your message here'
                            className="bg-white border p-2 flex-grow rounded-sm"
                        />

                        <button className='bg-blue-500 p-2 text-white rounded-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}

            </div>

        </div>
    )
}
