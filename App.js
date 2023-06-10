import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
	const [inputMessage, setInputMessage] = useState('');

	const handleButtonClick = () => {
		console.log('SEND : ', inputMessage);
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
