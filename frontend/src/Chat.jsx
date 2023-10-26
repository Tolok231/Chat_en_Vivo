import React, { useEffect, useState } from "react";
import {  
    Card,
    Icon,
    Button,
    Form,
    Input,
    Container,
    Item,
    Message,
    Divider
} from 'semantic-ui-react'
import ScrollToBottom from 'react-scroll-to-bottom'


const Chat = ({socket,username,room}) =>{

    const [currentMessage,setCurrentMessage] = useState("")
    const [MessageList,setMessageList] = useState([])

    const sendMessage = async() =>{
        if(username && currentMessage){
            const info = {
                message:currentMessage,
                room,
                author: username,
                time: new Date(Date.now()).getHours()
                +":"
                +new Date(Date.now()).getMinutes(),
            }

            await socket.emit("send_message",info)
            setMessageList((list)=>[...list,info]) 
            setCurrentMessage("")
        }
    }

    useEffect(() => {
        const messageHandle = (data)=>{
                setMessageList((list)=>[...list,data])    
        }
        socket.on("receive_message", messageHandle);

            return ()=>socket.off("receive_message", messageHandle);
      }, [socket]);
      

    return(
        <Container >
            <Card fluid>
                  <Card.Content header={`Chat en vivo ~~ Sala: ${room}`} />
                  <ScrollToBottom>
                  <Card.Content style={{height:"400px", padding:"5px"}} >
                    {MessageList.map((Item,i)=>{
                        return (
                            <span key={i}>
                            <Message style={{textAling: username===Item.author? 'right':'left'}}
                                success= {username===Item.author}
                                info = {username!==Item.author}
                            > 
                                <Message.Header>{Item.message}</Message.Header>
                                    <p>Enviado por: <strong>{Item.author}</strong>, a las <i>{Item.time}</i></p>
                                  
                            </Message>
                            <Divider/>
                            </span>
                        )
                    })}
                  </Card.Content>
                  </ScrollToBottom>
                  <Card.Content extra>
                    <Form>
                        <Form.Field>
                           <div className="ui action input">
                           <input 
                                value={currentMessage}
                                type="text" 
                                placeholder="Mensaje" 
                                onChange={e => setCurrentMessage(e.target.value)}
                                onKeyUp = {(e)=>{
                                    if (e.key==="Enter") {
                                        sendMessage()
                                    }
                                }}
                            />
                            <button type="button" onClick={()=>sendMessage()}
                            className="ui teal icon right labeled button">
                                <Icon name="send"/>
                                Enviar
                                </button>
                           </div>
                        </Form.Field>
                    </Form>
                  </Card.Content>
              </Card>

        </Container>
    )

}

export default Chat