import React from 'react'


export default function Avatar({userId, username}) {
    const colors = ['bg-red-200',
    'bg-green-200',  
    'bg-fuchsia-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-blue-200',
    'bg-orange-200',
    'bg-teal-200',  
    'bg-pink-200', 
    'bg-rose-200'];
    const userIdBase10 = parseInt(userId.substring(10), 16);
    const colorIndex = userIdBase10 % colors.length;
    const color = colors[colorIndex];
    
    return (
    <div>
        <div className={"w-8 h-8 rounded-full flex items-center "+color}>
            <div className='text-center text-gray-800 w-full opacity-70'>
                {username[0]}
            </div>
        </div>
    </div>
  )
}
