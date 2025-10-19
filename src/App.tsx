import { useState } from "react";
import {
	MentionsTextarea,
	type MentionItem,
} from "./components/mentions-textarea";

// Sample people data for @ mentions
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

// Sample channels for / mentions
const channelMentions: MentionItem[] = [
	{ id: "1", label: "General", value: "general", avatar: "💬" },
	{ id: "2", label: "Random", value: "random", avatar: "🎲" },
	{ id: "3", label: "Development", value: "dev", avatar: "💻" },
	{ id: "4", label: "Design", value: "design", avatar: "🎨" },
	{ id: "5", label: "Marketing", value: "marketing", avatar: "📢" },
	{ id: "6", label: "Support", value: "support", avatar: "🆘" },
];

// Sample tags for # mentions
const tagMentions: MentionItem[] = [
	{ id: "1", label: "Important", value: "important", avatar: "⭐" },
	{ id: "2", label: "Bug", value: "bug", avatar: "🐛" },
	{ id: "3", label: "Feature", value: "feature", avatar: "✨" },
	{ id: "4", label: "Urgent", value: "urgent", avatar: "🚨" },
	{ id: "5", label: "Question", value: "question", avatar: "❓" },
	{ id: "6", label: "Help", value: "help", avatar: "🆘" },
];

function App() {
	const [value, setValue] = useState("");

	const handleMentionSelect = (item: MentionItem) => {
		console.log("Selected mention:", item);
	};

	// Function to get different items based on trigger
	const getMentionItems = (trigger: string | null, _query: string): MentionItem[] => {
		switch (trigger) {
			case '@':
				return peopleMentions;
			case '/':
				return channelMentions;
			case '#':
				return tagMentions;
			default:
				return [];
		}
	};

	const customRenderMentionItem = (item: MentionItem, isSelected: boolean) => (
		<div className={`flex items-center gap-2 p-2 rounded ${isSelected ? 'bg-blue-100' : ''}`}>
			<span className="text-lg">{item.avatar}</span>
			<div className="flex flex-col">
				<span className="text-sm font-medium">{item.label}</span>
				<span className="text-xs text-muted-foreground">
					{item.value}
				</span>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-2xl">
				<h1 className="mb-6 text-3xl font-bold">
					React Mentions Textarea
				</h1>
				<div className="mb-8 space-y-2 text-muted-foreground">
					<p>Try these different triggers:</p>
					<ul className="list-disc list-inside space-y-1 ml-4">
						<li><code className="bg-gray-100 px-1 rounded">@</code> for people mentions</li>
						<li><code className="bg-gray-100 px-1 rounded">/</code> for channel mentions</li>
						<li><code className="bg-gray-100 px-1 rounded">#</code> for tag mentions</li>
					</ul>
				</div>

				<div className="space-y-4">
					<MentionsTextarea
						value={value}
						onChange={setValue}
						placeholder="Type @ for people, / for channels, or # for tags..."
						triggers={['@', '/', '#']}
						getMentionItems={getMentionItems}
						onMentionSelect={handleMentionSelect}
						renderMentionItem={customRenderMentionItem}
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
