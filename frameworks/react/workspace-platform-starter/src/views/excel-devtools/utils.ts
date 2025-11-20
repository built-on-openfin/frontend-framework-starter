import type * as React from "react";

export const getInputValue = (input: React.MutableRefObject<HTMLInputElement | null>): string => {
	return (input.current?.value ?? "").replace(/["']/g, "");
};
