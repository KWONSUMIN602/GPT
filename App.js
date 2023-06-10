import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
	const [inputMessage, setInputMessage] = useState('');
	const [outputMessage, setoOutputMessage] = useState('Result to be shown here!');
	const [outputImage, setOutputImage] = useState('Result to be shown here!');

	/**
	 * open ai api 의 chat 함수
	 */
	const handleButtonClick = () => {
		console.log('SEND : ', inputMessage);
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
				console.log(data.choices[0].messafe.content.trim());
				setoOutputMessage(data.choices[0].messafe.content.trim());
			})
			.catch((error) => {
				console.log('에러 :', error);
				setoOutputMessage('잠시후 다시 이용바랍니다.');
			});
	};

	/**
	 * open ai api 의 이미지 생성 함수
	 *
	 * n:생성 이미지 수
	 * size: 이미지 사이즈
	 */
	const generateImages = () => {
		console.log('SEND : ', inputMessage);
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
				console.log(data.data[0].url);
				setOutputImage(data.data[0].url);
			})
			.catch((error) => {
				console.log('에러 :', error);
				setOutputImage('잠시후 다시 이용바랍니다.');
			});
	};

	const handleTextInput = (text) => {
		setInputMessage(text);
		console.log('Print Text : ', text);
	};

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text>{outputMessage}</Text>
				<Text>{outputImage}</Text>
			</View>

			<View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 20 }}>
				<View style={{ flex: 1 }}>
					<TextInput placeholder="Enter your question" onChangeText={handleTextInput} />
				</View>

				<TouchableOpacity onPress={generateImages}>
					<View style={{ backgroundColor: 'red', padding: 5 }}>
						<Text>Send</Text>
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
});
