import { createLazyFileRoute } from "@tanstack/react-router";
import { useConnect } from "../hooks/useConnect.ts";
import { useIntentListener } from "../hooks/useIntentListener.ts";

export const Route = createLazyFileRoute("/dashboard")({
	component: Dashboard,
});

export function Dashboard() {
	useConnect();
	const { context, error } = useIntentListener("intent.test");

	console.log(context, error);

	return <h1>Dashboard</h1>;
}
