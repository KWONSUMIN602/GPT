import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'
import { GiftedChat } from 'react-native-gifted-chat';
import * as Speech from 'expo-speech';

export default function App() {
  const [inputMsg, setInputMsg] = useState('')
  const [messages, setMessages] = useState([])
  const [ansMsg, setAnsMsg] = useState('Result to be shown')


  const onHandleBtnClick = () => {
    if(inputMsg.toLocaleLowerCase().startsWith('generate image')){
      generateImg()
    }else{
      generateText()
    }
  }

  const generateText = () => {
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMsg,
      createAt: new Date(),
      user: {_id: 1}
    }

    setMessages((prevMsg) => GiftedChat.append(prevMsg, [message]))

    fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
      body: JSON.stringify({
        "messages": [{"role": "user", "content": inputMsg}],
        "model": "gpt-3.5-turbo",
      })

    }).then(res => res.json()).then(data => {
      // setAnsMsg(data.choices[0].message.content.trim())
setInputMsg('')
      console.log(data)
      const message = {
        _id: Math.random().toString(36).substring(7),
        text: data.choices[0].message.content.trim(),
        createAt: new Date(),
        user: { _id: 2, name: 'Open AI'}
      }
  
      setMessages((prevMsg) => GiftedChat.append(prevMsg, [message])) 
      options={};
      Speech.speak(data.choices[0].message.content.trim(), options)

    }).catch(err => console.log(err))

    setInputMsg('')
  }

  const generateImg = () => {

    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMsg,
      createAt: new Date(),
      user: {_id: 1}
    }

    setMessages((prevMsg) => GiftedChat.append(prevMsg, [message]))

    fetch(`https://api.openai.com/v1/images/generations`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
    },
      body: JSON.stringify({
        "prompt": inputMsg,
        "n": 2,
        "size": "1024x1024"
      })

    }).then(res => res.json()).then(data => {
      // console.log(data.data[0].url)
      // setAnsMsg(data.data[0].url)

      data.data.forEach(image => {
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: 'Image',
          createAt: new Date(),
          user: { _id: 2, name: 'Open AI'},
          image: image.url
        }
    
        setMessages((prevMsg) => GiftedChat.append(prevMsg, [message])) 
      })

      

    })

    setInputMsg('')
  }

  const onChangeText = (e) => {
    setInputMsg(e)
  }


  return (
    <ImageBackground source={require('./assets/moo.jpg')} resizeMode='cover' style={{flex: 1, width:'100%', height: '100%'}}>
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          {/* <Text>{ansMsg}</Text> */}
          <GiftedChat 
            messages={messages}
            renderInputToolbar={() => { }}
            minInputToolbarHeight={0}
            user={{ _id: 1 }}
          />
        </View>
        
        <View style={styles.textLayout}> 
          <View style={styles.sendLayout}>
            <TextInput placeholder='Enter your question' onChangeText={onChangeText} value={inputMsg}/>
          </View>
          
          <TouchableOpacity onPress={onHandleBtnClick} >
            <View style={styles.sendBg}>
              <MaterialIcons name="send" size={20} color={'white'}/>
            </View>
            
          </TouchableOpacity>
        </View>
        
        
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  textLayout: {
    flexDirection: 'row',
    marginVertical: 20,
    marginHorizontal: 20
  },
  sendBg: {
    backgroundColor: 'coral',
    padding: 5,
    minWidth: 40,
    minHeight: 40,
    borderRadius: 6,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  sendLayout: {
    flex: 1,
    justifyContent:'center',
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 6,
    minHeight: 40,
    paddingHorizontal: 20,
    marginHorizontal: 10
  }
});
