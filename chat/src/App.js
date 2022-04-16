import React, { Component, useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";




export default function App() {
  const [room, setroom] = useState('vacad')
  const [name, setname] = useState('')
  const [messages, setmessages] = useState([])
  let [allmessages,setallmessages] = useState([])
  let [value, setvalue] = useState('')
  const [isLoggedIn, setisLoggedIn] = useState(false)


  const client = new W3CWebSocket(`ws://localhost:8000/ws/chat/${room}/`)


  

useEffect(()=>{

    client.onopen = () =>{
      console.log('connected');
    }
    client.onmessage = (message) =>{
      const dataFromServer = JSON.parse(message.data)
      console.log(dataFromServer);
      if(dataFromServer){
        setmessages(messages=>messages.concat({
          msg:dataFromServer.message,
          name:dataFromServer.name
         }))
        
      }
      
    }
  },[])

  console.log(room);
  console.log(name);
  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault()
    setisLoggedIn(true)
  }


  const handleonSubmit = (e)=>{
    e.preventDefault();
    
    client.send(JSON.stringify({
      type: "message",
      message: value,
      name: name
    }));
    value=""
  // setallmessages(allmessages.push(messages))
  
  }

  
  console.log('messages',messages);
  console.log('allmessages',allmessages);
  return (
    <div>

    

      {isLoggedIn ? (
        <>
          <div className='container my-3 flex-col'>
            <form action="" onSubmit={handleonSubmit}>
            <p>room name:{room}</p>
            <p>username:{name}</p>
              <div className='my-3 '>
                
                {messages.map(element=>{
                  return(
                    <>
                    <div>{element.name}:{element.msg}</div>
                    </>
                  )
                })}
              </div>
              <input name="message" placeholder="your message" type="text"   onChange={e=>{
                setvalue(e.target.value)
              }}/>
              <button type="submit"  
              >
                Send
              </button>
            </form>
          </div>


        </>
      ) : (
        <>
          <div className='container my-3'>
            <form action="" onSubmit={handleSubmit}>
              <input type="text" placeholder="room_name" name="room_name" value={room} onChange={e => {
                setroom(e.target.value)
              }} />
              <input type="text" placeholder='username' name="username" onChange={e => {
                setname(e.target.value)
              }} />
              <button type="submit">Submit</button>
            </form>
          </div>

        </>
      )}
    </div>
  )
}