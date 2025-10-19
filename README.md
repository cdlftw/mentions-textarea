# Mentions Textarea

A flexible, customizable React component for textareas with @mention functionality. Drop it into any React project and style it to match your design system.

I created this component because I couldn't find a mentions textarea that worked out of the box with the features I needed. This component is currently styled with Tailwind CSS but can be easily customized for any styling system.

## Features

-   **@mention detection** - Automatically detects @ symbols and shows suggestions
-   **Keyboard navigation** - Arrow keys, Enter, Tab, and Escape support
-   **Fully customizable** - Works with any CSS framework or styling system
-   **Auto-resizing** - Built-in textarea auto-resize functionality
-   **Zero dependencies** - Only requires React and react-textarea-autosize
-   **TypeScript support** - Full type definitions included
-   **Accessible** - Keyboard navigation and screen reader friendly

## Installation

### Option 1: Copy the component file

```bash
# Copy the component to your project
cp mentions-textarea.tsx src/components/
```

### Option 2: Install dependencies

```bash
npm install react-textarea-autosize
# or
yarn add react-textarea-autosize
```

## Basic Usage

```tsx
import { MentionsTextarea, MentionItem } from "./components/mentions-textarea";

const users: MentionItem[] = [
	{ id: "1", label: "John Doe", value: "john.doe" },
	{ id: "2", label: "Jane Smith", value: "jane.smith" },
	{ id: "3", label: "Bob Johnson", value: "bob.johnson" },
];

function App() {
	const [value, setValue] = useState("");

	return (
		<MentionsTextarea
			value={value}
			onChange={setValue}
			mentionItems={users}
			placeholder="Type @ to mention someone..."
		/>
	);
}
```

## Advanced Usage

### With Submit Button

```tsx
<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	showSubmitButton={true}
	submitButtonText="Post Comment"
	onSubmit={() => {
		console.log("Posted:", value);
		setValue("");
	}}
/>
```

### With Custom Mention Rendering

```tsx
<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	renderMentionItem={(item, isSelected) => (
		<div className="flex items-center gap-2">
			<img
				src={item.avatar}
				alt={item.label}
				className="w-6 h-6 rounded-full"
			/>
			<div>
				<div className="font-medium">{item.label}</div>
				<div className="text-sm text-gray-500">@{item.value}</div>
			</div>
		</div>
	)}
/>
```

### With Custom Styling

```tsx
<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	className="my-custom-wrapper"
	placeholder="Start typing..."
	disabled={false}
	loading={false}
/>
```

## API Reference

### Props

| Prop                | Type                                                    | Default              | Description                             |
| ------------------- | ------------------------------------------------------- | -------------------- | --------------------------------------- |
| `value`             | `string`                                                | -                    | **Required.** The textarea value        |
| `onChange`          | `(value: string) => void`                               | -                    | **Required.** Called when value changes |
| `mentionItems`      | `MentionItem[]`                                         | `[]`                 | Array of mentionable items              |
| `placeholder`       | `string`                                                | `"Add a comment..."` | Textarea placeholder                    |
| `disabled`          | `boolean`                                               | `false`              | Disable the textarea                    |
| `loading`           | `boolean`                                               | `false`              | Show loading state                      |
| `className`         | `string`                                                | `""`                 | Additional CSS classes                  |
| `onKeyDown`         | `(e: KeyboardEvent) => void`                            | -                    | Custom keydown handler                  |
| `onMentionSelect`   | `(item: MentionItem) => void`                           | -                    | Called when mention is selected         |
| `renderMentionItem` | `(item: MentionItem, isSelected: boolean) => ReactNode` | -                    | Custom mention item renderer            |
| `showSubmitButton`  | `boolean`                                               | `false`              | Show submit button                      |
| `submitButtonText`  | `string`                                                | `"Submit"`           | Submit button text                      |
| `onSubmit`          | `() => void \| Promise<void>`                           | -                    | Submit handler                          |

### MentionItem Interface

```tsx
interface MentionItem {
	id: string; // Unique identifier
	label: string; // Display name
	value: string; // Username/handle (without @)
	avatar?: string; // Optional avatar URL
	fallback?: string; // Optional fallback text
}
```

## Styling Examples

### Tailwind CSS

```tsx
<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	className="w-full max-w-2xl"
	placeholder="Type @ to mention someone..."
/>
```

### Bootstrap

```tsx
<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	className="form-control"
	placeholder="Type @ to mention someone..."
/>
```

### CSS Modules

```tsx
import styles from "./MentionsTextarea.module.css";

<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	className={styles.textarea}
/>;
```

### Styled Components

```tsx
import styled from "styled-components";

const StyledMentionsTextarea = styled(MentionsTextarea)`
	border: 2px solid #e2e8f0;
	border-radius: 8px;
	padding: 12px;

	&:focus {
		border-color: #3182ce;
		box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
	}
`;

<StyledMentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
/>;
```

## Keyboard Navigation

-   **@** - Triggers mention suggestions
-   **Arrow Up/Down** - Navigate through suggestions
-   **Enter/Tab** - Select highlighted mention
-   **Escape** - Close mention popup
-   **Any other key** - Normal textarea behavior

## Customization

### Custom Mention Items

```tsx
const customMentions: MentionItem[] = [
	{
		id: "1",
		label: "John Doe",
		value: "john.doe",
		avatar: "https://example.com/avatar1.jpg",
		fallback: "JD",
	},
	{
		id: "2",
		label: "Jane Smith",
		value: "jane.smith",
		avatar: "https://example.com/avatar2.jpg",
		fallback: "JS",
	},
];
```

### Custom Mention Renderer

```tsx
<MentionsTextarea
	value={value}
	onChange={setValue}
	mentionItems={users}
	renderMentionItem={(item, isSelected) => (
		<div
			className={`flex items-center gap-3 p-2 ${
				isSelected ? "bg-blue-100" : ""
			}`}
		>
			<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
				{item.avatar ? (
					<img
						src={item.avatar}
						alt={item.label}
						className="w-8 h-8 rounded-full"
					/>
				) : (
					<span className="text-sm font-medium">{item.fallback}</span>
				)}
			</div>
			<div>
				<div className="font-medium">{item.label}</div>
				<div className="text-sm text-gray-500">@{item.value}</div>
			</div>
		</div>
	)}
/>
```

## Real-world Examples

### Chat Application

```tsx
function ChatInput() {
	const [message, setMessage] = useState("");
	const [users] = useState([
		{ id: "1", label: "Alice", value: "alice" },
		{ id: "2", label: "Bob", value: "bob" },
	]);

	const handleSubmit = async () => {
		await sendMessage(message);
		setMessage("");
	};

	return (
		<MentionsTextarea
			value={message}
			onChange={setMessage}
			mentionItems={users}
			placeholder="Type a message..."
			showSubmitButton={true}
			submitButtonText="Send"
			onSubmit={handleSubmit}
		/>
	);
}
```

### Comment System

```tsx
function CommentForm() {
	const [comment, setComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			await postComment(comment);
			setComment("");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<MentionsTextarea
			value={comment}
			onChange={setComment}
			mentionItems={users}
			placeholder="Write a comment..."
			showSubmitButton={true}
			submitButtonText="Post Comment"
			onSubmit={handleSubmit}
			loading={isSubmitting}
		/>
	);
}
```

## Browser Support

-   Chrome 60+
-   Firefox 55+
-   Safari 12+
-   Edge 79+

## Dependencies

-   React 16.8+ (hooks required)
-   react-textarea-autosize

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you have any questions or need help, please open an issue on GitHub.
