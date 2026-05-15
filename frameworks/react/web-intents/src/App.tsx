import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "./routes/views/provider";
import { Intents } from "./routes/views/intents";
import { ViewContact } from "./routes/views/view-contact.tsx";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Provider />} />
				<Route path="/intents" element={<Intents />} />
				<Route path="/contact" element={<ViewContact />} />
			</Routes>
		</BrowserRouter>
	);
}
