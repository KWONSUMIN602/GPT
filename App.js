import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
	ImageBackground,
	TextInput,
	TouchableOpacity,
	View,
	KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';
import * as Speech from 'expo-speech';

export default function App() {
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');

	const handleButtonClick = () => {
		console.log(inputMessage);
		if (inputMessage.toLocaleLowerCase().startsWith('generate image')) {
			generateImages();
			return;
		} else {
			generateText();
			return;
		}
	};

	const sendGiftedChat = ({ text, _id, name, image }) => {
		const message = {
			_id: Math.random().toString(36).substring(7),
			text: text,
			createdAt: new Date(),
			user: { _id, name },
			image,
		};

		setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));
	};

	/**
	 * open ai api 의 textchat 함수
	 */
	const generateText = () => {
		sendGiftedChat({ text: inputMessage, _id: 1, name: 'me' });

		fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer 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`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				prompt: [{ role: 'user', content: inputMessage }],
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				sendGiftedChat({ text: data.choices[0].messafe.content.trim(), _id: 2, name: 'OPEN AI' });

				options = {};
				Speech.speak(data.choices[0].messafe.content, options);
			})
			.catch((error) => {
				console.log('에러 :', error);
				sendGiftedChat({ text: 'Please use it again after a while.', _id: 2, name: 'OPEN AI' });
			});

		setInputMessage('');
	};

	/**
	 * open ai api 의 이미지 생성 함수
	 *
	 * n:생성 이미지 수
	 * size: 이미지 사이즈
	 */
	const generateImages = () => {
		const message = {
			_id: Math.random().toString(36).substring(7),
			text: inputMessage,
			createdAt: new Date(),
			user: { _id: 1 },
		};

		setMessages((previousMessages) => GiftedChat.append(previousMessages, [message]));

		fetch('https://api.openai.com/v1/images/generations', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer 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`,
			},
			body: JSON.stringify({
				prompt: inputMessage,
				n: 2,
				size: '1024x1024',
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				data.data.forEach((generateImage) => {
					sendGiftedChat({ text: 'Image', _id: 2, name: 'OPEN AI', image: generateImage.url });
				});
			})
			.catch((error) => {
				console.log('에러 :', error);
				sendGiftedChat({ text: 'Please use it again after a while.', _id: 2, name: 'OPEN AI' });
			});

		setInputMessage('');
	};

	const handleTextInput = (text) => {
		setInputMessage(text);
		console.log('Print Text : ', text);
	};

	return (
		<ImageBackground
			source={require('./assets/bg.jpeg')}
			resizeMode="cover"
			style={{ flex: 1, width: '100%', height: '100%' }}
		>
			<View style={{ flex: 1 }}>
				<View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
					<GiftedChat
						messages={messages}
						renderInputToolbar={() => {}}
						user={{ _id: 1 }}
						minInputToolbarHeight={0}
					/>
				</View>

				<KeyboardAvoidingView behavior={'padding'}>
					<View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 20 }}>
						<View
							style={{
								flex: 1,
								backgroundColor: 'white',
								borderRadius: 10,
								borderColor: 'grey',
								borderWidth: 1,
								height: 60,
								marginHorizontal: 10,
								justifyContent: 'center',
								paddingHorizontal: 10,
							}}
						>
							<TextInput
								placeholder="Enter your question"
								onChangeText={handleTextInput}
								value={inputMessage}
								style={{
									outlineStyle: 'none',
								}}
							/>
						</View>

						<TouchableOpacity onPress={handleButtonClick}>
							<View
								style={{
									backgroundColor: '#0084ff',
									padding: 5,
									marginRight: 10,
									marginBottom: 10,
									borderRadius: '100%',
									width: 60,
									height: 60,
									justifyContent: 'center',
								}}
							>
								<MaterialIcons
									name="send"
									size={30}
									color={'white'}
									style={{ marginLeft: 'auto', marginRight: 'auto' }}
								/>
							</View>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>

				<StatusBar style="auto" />
			</View>
		</ImageBackground>
	);
}
