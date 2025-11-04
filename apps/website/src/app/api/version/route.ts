import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
	try {
		const response = await fetch(
			"https://api.github.com/repos/nativeui-org/primitives/releases?per_page=100",
			{
				headers: {
					Accept: "application/vnd.github.v3+json",
				},
				next: { revalidate: 3600 },
			},
		);

		if (!response.ok) {
			throw new Error("Failed to fetch releases");
		}

		const releases = await response.json();

		// Find the latest primitives@ release
		const primitivesRelease = releases.find((release: { tag_name: string }) =>
			release.tag_name.startsWith("primitives@"),
		);

		if (!primitivesRelease) {
			return NextResponse.json({ version: null });
		}

		const version = primitivesRelease.tag_name.replace("primitives@", "");

		return NextResponse.json({ version });
	} catch {
		return NextResponse.json({ version: null });
	}
}
