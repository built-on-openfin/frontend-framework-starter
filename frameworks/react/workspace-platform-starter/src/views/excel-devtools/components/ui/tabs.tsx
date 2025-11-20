import * as React from "react";

type TabsContextType = {
	activeTab: string;
	setActiveTab: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

type TabsProps = {
	children: React.ReactNode;
	defaultValue: string;
	value?: string;
	onValueChange?: (value: string) => void;
	className?: string;
};

export function Tabs({ children, defaultValue, value, onValueChange, className = "" }: TabsProps) {
	const [internalValue, setInternalValue] = React.useState(defaultValue);

	const activeTab = value !== undefined ? value : internalValue;

	const setActiveTab = (newValue: string) => {
		if (onValueChange) {
			onValueChange(newValue);
		} else {
			setInternalValue(newValue);
		}
	};

	return (
		<TabsContext.Provider value={{ activeTab, setActiveTab }}>
			<div className={className}>{children}</div>
		</TabsContext.Provider>
	);
}

type TabsListProps = {
	children: React.ReactNode;
	className?: string;
};

function TabsList({ children, className = "" }: TabsListProps) {
	return (
		<div
			className={`
				inline-flex gap-1 p-0.5
				bg-gray-100 rounded-lg
				${className}
			`
				.trim()
				.replace(/\s+/g, " ")}
		>
			{children}
		</div>
	);
}

type TabsTriggerProps = {
	value: string;
	children: React.ReactNode;
	className?: string;
};

function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error("TabsTrigger must be used within Tabs");
	}

	const isActive = context.activeTab === value;

	return (
		<button
			type="button"
			onClick={() => context.setActiveTab(value)}
			className={`
				px-3 py-1 rounded-md
                text-sm font-medium
                transition-colors duration-150
                ${isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}
                ${className}
            `
				.trim()
				.replace(/\s+/g, " ")}
		>
			{children}
		</button>
	);
}

type TabsContentProps = {
	value: string;
	children: React.ReactNode;
	className?: string;
};

function TabsContent({ value, children, className = "" }: TabsContentProps) {
	const context = React.useContext(TabsContext);
	if (!context) {
		throw new Error("TabsContent must be used within Tabs");
	}

	if (context.activeTab !== value) return null;

	return <div className={className}>{children}</div>;
}

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
