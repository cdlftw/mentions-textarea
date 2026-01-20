import { useState } from "react";
import {
	MentionsTextarea,
	type MentionItem,
} from "./components/mentions-textarea";

// Sample people data for mentions
const peopleMentions: MentionItem[] = [
	{ id: "1", label: "Alice Johnson", value: "alice.johnson", avatar: "👩" },
	{ id: "2", label: "Bob Smith", value: "bob.smith", avatar: "👨" },
	{ id: "3", label: "Charlie Brown", value: "charlie.brown", avatar: "🧑" },
	{ id: "4", label: "Diana Prince", value: "diana.prince", avatar: "👩‍💼" },
	{ id: "5", label: "Ethan Hunt", value: "ethan.hunt", avatar: "👨‍💼" },
	{ id: "6", label: "Fiona Green", value: "fiona.green", avatar: "👩‍🎨" },
	{ id: "7", label: "George Wilson", value: "george.wilson", avatar: "👨‍🔬" },
	{ id: "8", label: "Hannah Davis", value: "hannah.davis", avatar: "👩‍🏫" },
	{ id: "9", label: "Ian Murphy", value: "ian.murphy", avatar: "👨‍🎓" },
	{ id: "10", label: "Julia Roberts", value: "julia.roberts", avatar: "👩‍⚕️" },
];

function App() {
	const [value, setValue] = useState("");

	const handleMentionSelect = (item: MentionItem) => {
		console.log("Selected mention:", item);
	};

	const customRenderMentionItem = (item: MentionItem) => (
		<div className="flex items-center gap-2">
			<span className="text-lg">{item.avatar}</span>
			<div className="flex flex-col">
				<span className="text-sm font-medium">{item.label}</span>
				<span className="text-xs text-muted-foreground">
					@{item.value}
				</span>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-2xl">
				<h1 className="mb-6 text-3xl font-bold">
					Mentions Textarea Demo
				</h1>
				<p className="mb-8 text-muted-foreground">
					Try typing @ followed by a person's name to see mentions in
					action!
				</p>

				<div className="space-y-4">
					<MentionsTextarea
						value={value}
						onChange={setValue}
						placeholder="Type @ to mention a person..."
						mentionItems={peopleMentions}
						onMentionSelect={handleMentionSelect}
						// renderMentionItem={customRenderMentionItem}
						showSubmitButton={true}
						submitButtonText="Post Comment"
						onSubmit={() => {
							alert(`Posted: ${value}`);
							setValue("");
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
