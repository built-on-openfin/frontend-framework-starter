import { expect, test, type FrameLocator, type Page } from "@playwright/test";

async function getAppFrame(page: Page, heading: string): Promise<FrameLocator> {
	const frames = page.frameLocator("main iframe");
	const findFrameIndex = async (): Promise<number> => {
		const frameCount = await page.locator("main iframe").count();

		for (let index = 0; index < frameCount; index += 1) {
			const frame = frames.nth(index);
			if (await frame.getByRole("heading", { name: heading }).isVisible().catch(() => false)) {
				return index;
			}
		}

		return -1;
	};

	await expect
		.poll(findFrameIndex, { message: `Find app frame with heading "${heading}".` })
		.not.toBe(-1);

	const frameIndex = await findFrameIndex();
	if (frameIndex !== -1) {
		return frames.nth(frameIndex);
	}

	throw new Error(`Unable to find app frame with heading "${heading}".`);
}

async function raiseIntent(page: Page, options: {
	intentValue: "ViewContact" | "ViewQuote";
	context: Record<string, unknown>;
}): Promise<void> {
	const intentsFrame = await getAppFrame(page, "Raise Intent");

	await intentsFrame.locator("#intentName").selectOption(options.intentValue);
	await intentsFrame.locator("#contextBody").fill(JSON.stringify(options.context, null, 2));
	await intentsFrame.getByRole("button", { name: "Raise Intent" }).click();
}

async function expectReceivedContext(
	page: Page,
	options: {
		frameHeading: string;
		expectedContext: Record<string, unknown>;
	},
): Promise<void> {
	const appFrame = await getAppFrame(page, options.frameHeading);
	const receivedContext = appFrame.locator("#receivedContext");

	await expect(receivedContext).toHaveValue(JSON.stringify(options.expectedContext, null, 2));
}

test("raises contact and quote intents to newly launched apps", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByText("FDC3 Intents", { exact: true })).toBeVisible();
	const intentsFrame = await getAppFrame(page, "Raise Intent");
	await expect(intentsFrame.getByRole("button", { name: "Raise Intent" })).toBeVisible();

	const contactContext = {
		name: "Ada Lovelace",
		id: {
			email: "ada.lovelace@example.com",
		},
	};

	await raiseIntent(page, {
		intentValue: "ViewContact",
		context: contactContext,
	});

	await expect(page.getByText("Contact")).toBeVisible();
	await expectReceivedContext(page, {
		frameHeading: "View Contact",
		expectedContext: {
			...contactContext,
			type: "fdc3.contact",
		},
	});

	const quoteContext = {
		name: "MSFT",
		id: {
			ticker: "MSFT",
		},
	};

	await raiseIntent(page, {
		intentValue: "ViewQuote",
		context: quoteContext,
	});

	await expect(page.getByText("Quote")).toBeVisible();
	await expectReceivedContext(page, {
		frameHeading: "View Quote",
		expectedContext: {
			...quoteContext,
			type: "custom.instrument",
		},
	});
});
