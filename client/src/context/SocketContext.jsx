import { HOST } from '@/utils/constants';
import { useAppStore } from "@/store";
import { createContext,useContext, useEffect,useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext=createContext(null);
export const useSocket = () => {
    return useContext(SocketContext);
};
export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(()=>{
    if(userInfo){
        socket.current=io(HOST,{
          withCredentials:true,
          query:{userId:userInfo.id},
      });
        socket.current.on("connect",()=>{
            console.log("Connected to Socket Server");
        })
        const handleReceiveMessage = (message) => {
          // Access the latest state values
          const {
            selectedChatData: currentChatData,
            selectedChatType: currentChatType,
            addMessage,
            addContactInDMContacts,
          } = useAppStore.getState();
  
          if (
            currentChatType !== undefined &&
            (currentChatData._id === message.sender._id ||
              currentChatData._id === message.recipient._id)
          ) {
            addMessage(message);
          }
          addContactInDMContacts(message);
        };

        const handleReceiveChannelMessage=()=>{
          const {
            selectedChatData,
            selectedChatType,
            addMessage,
            addChannelInChannelLists,
          } = useAppStore.getState();
  
          if (
            selectedChatType !== undefined &&
            selectedChatData._id === message.channelId
          ) {
            addMessage(message);
          }
          addChannelInChannelLists(message);
        }

        socket.current.on("receiveMessage", handleReceiveMessage);
        socket.current.on("receive-channel-message",handleReceiveChannelMessage);
        
        return ()=>{
            socket.current.disconnect();
        }
    }
  },[userInfo])

  return (
    <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
  )
}