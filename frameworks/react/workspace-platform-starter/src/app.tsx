import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "./Provider";
import { ExcelDevtools } from "./views/excel-devtools/excel-devtools";
import { FxPage } from "./views/fx/fx";
import { Monitor } from "./views/monitor";
import { Ticket } from "./views/ticket";
import { View1 } from "./views/view1";
import { View2 } from "./views/view2";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Provider />} />
				<Route path="/view1" element={<View1 />} />
				<Route path="/view2" element={<View2 />} />
				<Route path="/stock-peers-monitor" element={<Monitor />}></Route>
				<Route path="/fx" element={<FxPage />}></Route>
				<Route path="/fx-ticket" element={<Ticket />}></Route>
				<Route path="/excel-devtools" element={<ExcelDevtools />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
