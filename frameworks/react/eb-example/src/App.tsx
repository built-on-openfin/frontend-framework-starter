import "./App.css";
import { ReceiveContext } from "./components/ReceiveContext";
import { SendContext } from "./components/SendContext";

function App() {
	return (
		<>
			<SendContext />
			<ReceiveContext />
		</>
	);
}

export default App;
