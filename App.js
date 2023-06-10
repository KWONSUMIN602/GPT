import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
	const [inputMessage, setInputMessage] = useState('');

	const handleButtonClick = () => {
		console.log('SEND : ', inputMessage);
		fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer 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`,
			},
			body: JSON.stringify({
				model: 'text-davinci-003',
				prompt: inputMessage,
			}),
		})
			.then((res) => res.json())
			.then((data) => console.log('GPT MODEL:', data));
	};

	const handleTextInput = (text) => {
		setInputMessage(text);
		console.log('Print Text : ', text);
	};

	return (
		<View style={styles.container}>
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<Text>Results to be shown here!</Text>
			</View>

			<View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 20 }}>
				<View style={{ flex: 1 }}>
					<TextInput placeholder="Enter your question" onChangeText={handleTextInput} />
				</View>

				<TouchableOpacity onPress={handleButtonClick}>
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
