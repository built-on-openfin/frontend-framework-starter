import "./App.css";
import { Notification } from "./components/Notification";
import { ReceiveContext } from "./components/ReceiveContext";
import { SendContext } from "./components/SendContext";

function App() {
	return (
		<>
			<SendContext />
			<ReceiveContext />
			<Notification />
		</>
	);
}

export default App;
