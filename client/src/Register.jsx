import React, { useState } from 'react'

export default function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='bg-blue-50 h-screen flex items-center'>
            <form action="" className='w-64 mx-auto'>
                <input 
                    type="text" 
                    placeholder='Username' 
                    className='block w-full rounded-sm p-2 mb-2 border' 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder='Password' 
                    className='block w-full rounded-sm p-2 mb-2 border'
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                    className='bg-blue-500 text-white block w-full rounded-sm p-2'>
                    Register
                </button>
            </form>
        </div>
    )
}
