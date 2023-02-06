import React, { useContext, useEffect } from 'react'
import { ActionContext } from './DataContext'

function Message({ msg, messages, user }) {
  const { currentRoom, setCurrentRoom, conversations, setConversations, } = useContext(ActionContext)

  // useEffect(() => {
  //   setMessages(currentRoom.messages)
  // }, [currentRoom])

  // console.log(messages)

  return (

    <div >
      <div className={`rounded px-2 py-1 bg-primary  ${user._id == msg.sentBy ? 'text-white' : 'text-dark'}`} >{msg.text}</div >
      <div className={`text-muted small ${user._id == msg.sentBy ? 'text-right' : 'text-left'} `}>{msg.sentBy}</div>
    </div>
  )
}

export default Message