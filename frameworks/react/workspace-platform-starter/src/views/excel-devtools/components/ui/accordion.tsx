import * as React from "react";
import { FaChevronDown } from "react-icons/fa";

type AccordionContextType = {
	openItems: string[];
	toggleItem: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextType | null>(null);

type AccordionProps = {
	children: React.ReactNode;
	defaultOpen?: string[];
	className?: string;
};

export function Accordion({ children, defaultOpen = [], className = "" }: AccordionProps) {
	const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen);

	const toggleItem = (value: string) => {
		setOpenItems((prev) =>
			prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
		);
	};

	return (
		<AccordionContext.Provider value={{ openItems, toggleItem }}>
			<div className={`space-y-2 ${className}`}>{children}</div>
		</AccordionContext.Provider>
	);
}

type AccordionItemProps = {
	value: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	className?: string;
};

function AccordionItem({ value, children, className = "" }: AccordionItemProps) {
	const context = React.useContext(AccordionContext);
	if (!context) {
		throw new Error("AccordionItem must be used within Accordion");
	}

	const isOpen = context.openItems.includes(value);

	return <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>{children}</div>;
}

type AccordionTriggerProps = {
	children: React.ReactNode;
	value: string;
	icon?: React.ReactNode;
	className?: string;
};

function AccordionTrigger({ children, value, icon, className = "" }: AccordionTriggerProps) {
	const context = React.useContext(AccordionContext);
	if (!context) {
		throw new Error("AccordionTrigger must be used within Accordion");
	}

	const isOpen = context.openItems.includes(value);

	return (
		<button
			type="button"
			onClick={() => context.toggleItem(value)}
			className={`
                w-full px-3 py-2
                flex items-center justify-between gap-4
                bg-gray-50 hover:bg-gray-100
                text-left font-semibold text-gray-900
                transition-colors duration-150
                ${className}
            `
				.trim()
				.replace(/\s+/g, " ")}
		>
			<div className="flex items-center gap-3">
				{icon && <span className="text-xl">{icon}</span>}
				<span>{children}</span>
			</div>
			<FaChevronDown
				className={`
					text-gray-500 transition-transform duration-200
					${isOpen ? "rotate-180" : ""}
				`}
			/>
		</button>
	);
}

type AccordionContentProps = {
	value: string;
	children: React.ReactNode;
	className?: string;
};

function AccordionContent({ value, children, className = "" }: AccordionContentProps) {
	const context = React.useContext(AccordionContext);
	if (!context) {
		throw new Error("AccordionContent must be used within Accordion");
	}

	const isOpen = context.openItems.includes(value);

	if (!isOpen) return null;

	return <div className={`px-3 py-2 bg-white ${className}`}>{children}</div>;
}

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
