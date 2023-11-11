import { html } from "lit"

export const processBatchesPage = (request: any, response: any) => {
	const requestJson = JSON.stringify(request, null, 2)
	return html`
		<main>
			<div class="bg-white m-4 rounded border">
				<details>
					<summary class="flex justify-between border-b p-4">
						<p class="cursor-pointer">Request</p>
						<button>
							<span class="material-symbols-outlined">content_copy</span>
						</button>
					</summary>
					<pre class="whitespace-pre-wrap p-4"><code>${requestJson}</code></pre>
				</details>
			</div>
			<div class="bg-white m-4 p-4 rounded border">
				<details>
					<summary class="flex justify-between">
						<p class="cursor-pointer">Response</p>
						<button onclick=${() => {
							navigator.clipboard.writeText(JSON.stringify(response, null, 2))
						}}>
							<span class="material-symbols-outlined">content_copy</span>
						</button>
					</summary>
					<pre class="whitespace-pre-wrap"><code>${JSON.stringify(response, null, 2)}</code></pre>
				</details>
			</div>
			<details>
				<summary>Response</summary>
				<pre class="whitespace-pre-wrap"><code>${JSON.stringify(request, null, 2)}</code></pre>
			</details>
		</main>
	`
}