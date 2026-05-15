import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "./routes/views/provider";
import { Intents } from "./routes/views/intents";
import { ViewContact } from "./routes/views/view-contact.tsx";
import { ViewQuote } from "./routes/views/view-quote.tsx";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Provider />} />
				<Route path="/intents" element={<Intents />} />
				<Route path="/contact" element={<ViewContact />} />
				<Route path="/quote" element={<ViewQuote />} />
			</Routes>
		</BrowserRouter>
	);
}
