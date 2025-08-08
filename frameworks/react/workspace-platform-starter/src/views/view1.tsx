import { useRaiseIntent } from '../hooks/useRaiseIntent';

export function View1() {
	const raiseIntent = useRaiseIntent();

	const handleViewContact = () => {
		raiseIntent('ViewContact', { type: 'fdc3.contact' })
	}

	const handleViewQuote = () => {
		raiseIntent('ViewQuote', { type: 'custom.instrument' })
	}


	return (
		<div className="flex-col">
			<button type="button" onClick={handleViewContact}>
				View Contact
			</button>
			<button type="button" onClick={handleViewQuote}>
				View Quote
			</button>
		</div>
	);
}
