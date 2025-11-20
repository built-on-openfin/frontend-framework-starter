import * as React from "react";

type CardProps = {
	children: React.ReactNode;
	className?: string;
};

type CardHeaderProps = {
	children: React.ReactNode;
	className?: string;
};

type CardTitleProps = {
	children: React.ReactNode;
	className?: string;
};

type CardDescriptionProps = {
	children: React.ReactNode;
	className?: string;
};

type CardContentProps = {
	children: React.ReactNode;
	className?: string;
};

export function Card({ children, className = "" }: CardProps) {
	return (
		<div className={`bg-white border border-gray-300 rounded-2xl shadow-sm overflow-hidden ${className}`}>
			{children}
		</div>
	);
}

function CardHeader({ children, className = "" }: CardHeaderProps) {
	return <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>;
}

function CardTitle({ children, className = "" }: CardTitleProps) {
	return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

function CardDescription({ children, className = "" }: CardDescriptionProps) {
	return <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>;
}

function CardContent({ children, className = "" }: CardContentProps) {
	return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
