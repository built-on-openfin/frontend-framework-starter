import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "./Provider";
import { View1 } from "./views/view1";
import { View2 } from "./views/view2";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Provider />} />
				<Route path="/view1" element={<View1 />} />
				<Route path="/view2" element={<View2 />} />
			</Routes>
		</BrowserRouter>
	);
}
