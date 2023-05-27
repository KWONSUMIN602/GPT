import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'

export default function App() {
  const [inputMsg, setInputMsg] = useState('')
  const [ansMsg, setAnsMsg] = useState('Result to be shown')

  const handleBtnClick = () => {
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
      setAnsMsg(data.choices[0].message.content.trim())
    })

    setInputMsg('')
  }

  const generateImg = () => {
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
      console.log(data.data[0].url)
      setAnsMsg(data.data[0].url)
    })

    // setInputMsg('')
  }

  const onChangeText = (e) => {
    setInputMsg(e)
  }


  return (
    <View style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text>{ansMsg}</Text>
      </View>
      
      <View style={styles.textLayout}> 
        <View style={styles.sendLayout}>
          <TextInput placeholder='Enter your question' onChangeText={onChangeText} />
        </View>
        
        <TouchableOpacity onPress={handleBtnClick} value={inputMsg}>
          <View style={styles.sendBg}>
            <MaterialIcons name="send" size={20} color={'white'}/>
          </View>
          
        </TouchableOpacity>
      </View>
      
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
