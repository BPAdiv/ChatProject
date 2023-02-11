import React, { useContext, useEffect } from 'react'
import { ActionContext } from './DataContext'
import { format } from "timeago.js"
function Message({ msg, messages, user }) {
  // const { currentRoom, setCurrentRoom, conversations, setConversations, } = useContext(ActionContext)


  return (

    <div >
      <div className={`rounded px-2 py-1 ${msg.sentBy == user._id ? 'text-white' : 'border-none'}`} style={msg.sentBy == user._id ? { alignSelf: "flex-end", alignItems: "flex-end", backgroundColor: "#E5AB50" } : { alignItems: "flex-start", backgroundColor: "#322A24" }}
      >{msg.text}</div >
      <div className={` text-white small ${user._id == msg.sentBy ? 'text-right' : 'text-left'} `}>{msg.sentBy}</div>
      <div className={` text-white small ${user._id == msg.sentBy ? 'text-right' : 'text-left'} `}>{format(msg?.createdAt)}</div>
    </div>
  )
}

export default Message