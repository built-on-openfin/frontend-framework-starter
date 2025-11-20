import * as React from "react";
import { type ButtonSize, type ButtonVariant } from "../../types";

type ButtonProps = {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	icon?: React.ReactNode;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	type?: "button" | "submit" | "reset";
	className?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
	primary: "bg-[#0091EB] hover:bg-[#0077C2] text-white shadow-sm",
	secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm",
	destructive: "bg-[#e4002b] hover:bg-[#c4001b] text-white shadow-sm",
	ghost: "hover:bg-gray-100 text-gray-700",
	outline: "border-2 border-current hover:bg-gray-50 text-gray-700",
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
	icon: "p-2",
};

export function Button({
	children,
	variant = "secondary",
	size = "md",
	icon,
	onClick,
	disabled = false,
	type = "button",
	className = "",
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`
				inline-flex items-center justify-center gap-2
				rounded-lg font-medium
				transition-colors duration-150
				disabled:opacity-50 disabled:cursor-not-allowed
				focus:outline-none focus:ring-2 focus:ring-[#0091EB] focus:ring-offset-2
				${variantStyles[variant]}
				${sizeStyles[size]}
				${className}
			`
				.trim()
				.replace(/\s+/g, " ")}
		>
			{icon && <span className="inline-flex">{icon}</span>}
			{children}
		</button>
	);
}
