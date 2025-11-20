import * as React from "react";

type InputProps = {
	label?: string;
	placeholder?: string;
	helperText?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	type?: string;
	disabled?: boolean;
	required?: boolean;
	error?: string;
	className?: string;
	id?: string;
};

export function Input({
	label,
	placeholder,
	helperText,
	value,
	onChange,
	onBlur,
	type = "text",
	disabled = false,
	required = false,
	error,
	className = "",
	id,
}: InputProps) {
	const inputId = id || React.useId();

	return (
		<div className={`flex flex-col gap-1.5 ${className}`}>
			{label && (
				<label htmlFor={inputId} className="text-sm font-medium text-gray-700">
					{label}
					{required && <span className="text-red-600 ml-1">*</span>}
				</label>
			)}
			<input
				id={inputId}
				type={type}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				placeholder={placeholder}
				disabled={disabled}
				required={required}
				className={`
					px-3 py-2
					border rounded-lg
					text-gray-900 placeholder-gray-400
					focus:outline-none focus:ring-2 focus:ring-[#0091EB] focus:border-transparent
					disabled:bg-gray-100 disabled:cursor-not-allowed
					${error ? "border-red-500" : "border-gray-300"}
				`
					.trim()
					.replace(/\s+/g, " ")}
			/>
			{error && <p className="text-sm text-red-600">{error}</p>}
			{helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
		</div>
	);
}
