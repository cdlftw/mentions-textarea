import { useState, useRef, useEffect, useMemo, memo } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useMentionPosition } from "../lib/use-mention-position";

export interface MentionItem {
	id: string;
	label: string;
	value: string;
	avatar?: string;
	fallback?: string;
}

interface MentionsTextareaProps {
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	placeholder?: string;
	disabled?: boolean;
	loading?: boolean;
	className?: string;
	showSubmitButton?: boolean;
	submitButtonText?: string;
	onSubmit?: () => void | Promise<void>;
	mentionItems?: MentionItem[];
	onMentionSelect?: (item: MentionItem) => void;
	renderMentionItem?: (
		item: MentionItem,
		isSelected: boolean
	) => React.ReactNode;
	triggers?: string[];
	getMentionItems?: (trigger: string | null, query: string) => MentionItem[];
}

export function MentionsTextarea({
	value,
	onChange,
	onKeyDown,
	placeholder = "Add a comment...",
	disabled = false,
	loading = false,
	className = "",
	showSubmitButton = false,
	submitButtonText = "Submit",
	onSubmit,
	mentionItems = [],
	onMentionSelect,
	renderMentionItem,
	triggers = ["@"],
	getMentionItems,
}: MentionsTextareaProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isNavigating, setIsNavigating] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const popupRef = useRef<HTMLDivElement>(null);

	// Memoize triggers to prevent unnecessary re-renders
	const memoizedTriggers = useMemo(() => triggers, [triggers]);

	const { popupPos, query, update, clear, currentTrigger } = useMentionPosition(
		textareaRef as React.RefObject<HTMLTextAreaElement>,
		memoizedTriggers
	);

	// Get items based on trigger and query
	const itemsToFilter = getMentionItems
		? getMentionItems(currentTrigger, query)
		: mentionItems;

	// Filter items based on query - memoized for performance
	const filteredItems = useMemo(() => {
		return itemsToFilter.filter(
			(item) =>
				item.label.toLowerCase().includes(query.toLowerCase()) ||
				item.value.toLowerCase().includes(query.toLowerCase())
		);
	}, [itemsToFilter, query]);

	// Reset selection when popup opens
	useEffect(() => {
		if (popupPos) {
			setSelectedIndex(0);
		}
	}, [popupPos]);

	// Keep selection in bounds
	useEffect(() => {
		if (filteredItems.length > 0 && selectedIndex >= filteredItems.length) {
			setSelectedIndex(0);
		}
	}, [filteredItems.length, selectedIndex]);

	// Scroll selected item into view
	useEffect(() => {
		if (popupPos && popupRef.current) {
			const selectedElement = popupRef.current.querySelector(`[data-index="${selectedIndex}"]`);
			if (selectedElement) {
				setTimeout(() => {
					selectedElement.scrollIntoView({
						block: 'nearest',
						behavior: 'instant'
					});
				}, 0);
			}
		}
	}, [selectedIndex, popupPos]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (popupPos && filteredItems.length > 0) {
			if (e.key === "ArrowDown") {
				e.preventDefault();
				setIsNavigating(true);
				setSelectedIndex((prev) =>
					prev < filteredItems.length - 1 ? prev + 1 : 0
				);
				return;
			}

			if (e.key === "ArrowUp") {
				e.preventDefault();
				setIsNavigating(true);
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : filteredItems.length - 1
				);
				return;
			}

			if (e.key === "Enter" || e.key === "Tab") {
				e.preventDefault();
				setIsNavigating(false);
				handleMentionSelect(filteredItems[selectedIndex]);
				return;
			}

			if (e.key === "Escape") {
				e.preventDefault();
				setIsNavigating(false);
				clear();
				return;
			}
		}

		setIsNavigating(false);
		onKeyDown?.(e);
	};

	const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(e.target.value);
		update();
	};

	const handleMentionSelect = (item: MentionItem) => {
		if (!currentTrigger) return;

		const lastTriggerIndex = value.lastIndexOf(currentTrigger);
		if (lastTriggerIndex !== -1) {
			const beforeTrigger = value.substring(0, lastTriggerIndex);
			const afterTrigger = value.substring(lastTriggerIndex + query.length + 1);
			const newText = `${beforeTrigger}${currentTrigger}${item.value} ${afterTrigger}`;
			onChange(newText);

			// Position cursor after the mention
			setTimeout(() => {
				if (textareaRef.current) {
					const newCursorPosition =
						beforeTrigger.length + item.value.length + 2;
					textareaRef.current.setSelectionRange(
						newCursorPosition,
						newCursorPosition
					);
					textareaRef.current.focus();
				}
			}, 0);
		}

		clear();
		setSelectedIndex(0);
		onMentionSelect?.(item);
	};

	// Memoized mention item component for performance
	const MentionItemComponent = memo(({ item, index }: { item: MentionItem; index: number }) => {
		const isSelected = index === selectedIndex;

		return (
			<div
				key={item.id}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handleMentionSelect(item);
				}}
				className={`flex items-center gap-2 cursor-pointer rounded-sm px-2 py-1.5 text-sm select-none ${isSelected
					? "bg-blue-100 text-blue-900"
					: "hover:bg-gray-100"
					}`}
				data-selected={isSelected}
				data-index={index}
				onMouseDown={(e) => e.preventDefault()}
				style={{
					userSelect: 'none',
					WebkitUserSelect: 'none',
					MozUserSelect: 'none',
					msUserSelect: 'none'
				}}
			>
				{renderMentionItem ? (
					renderMentionItem(item, isSelected)
				) : (
					<>
						<span className="text-sm font-medium">
							{item.label}
						</span>
						<span className="text-xs text-gray-500">
							@{item.value}
						</span>
					</>
				)}
			</div>
		);
	});


	const renderMentionPopup = useMemo(() => {
		if (!popupPos) return null;

		return (
			<div
				ref={popupRef}
				style={{
					position: "fixed",
					top: popupPos.top,
					left: popupPos.left,
					willChange: 'transform',
					contain: 'layout style paint'
				}}
				className="z-50 w-80 rounded-md border border-gray-200 bg-white p-0 shadow-lg select-none"
				onMouseDown={(e) => e.preventDefault()}
			>
				<div className="max-h-[300px] overflow-y-auto">
					{filteredItems.length === 0 ? (
						<div className="py-6 text-center text-sm text-gray-500">
							No items found.
						</div>
					) : (
						<div className="p-1">
							{filteredItems
								.slice(0, 20)
								.map((item, index) => (
									<MentionItemComponent key={item.id} item={item} index={index} />
								))}
						</div>
					)}
				</div>
			</div>
		);
	}, [popupPos, filteredItems, selectedIndex, renderMentionItem]);

	const renderSubmitButton = () => {
		if (!showSubmitButton) return null;

		return (
			<div className="mt-2 flex justify-end">
				<button
					onClick={onSubmit}
					disabled={!value.trim() || disabled || loading}
					className="rounded-md px-4 py-2 text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
				>
					{loading ? "Posting..." : submitButtonText}
				</button>
			</div>
		);
	};

	return (
		<div className="w-full">
			<div className="relative">
				<TextareaAutosize
					ref={textareaRef}
					className={`min-h-16 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-base transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 md:text-sm ${disabled ? "cursor-not-allowed opacity-50" : ""
						} ${className}`}
					placeholder={placeholder}
					value={value}
					onChange={handleTextChange}
					onKeyUp={() => {
						// Don't update position while navigating to prevent jumping
						if (!isNavigating) {
							update();
						}
					}}
					onClick={update}
					onScroll={update}
					onKeyDown={handleKeyDown}
					disabled={disabled || loading}
					minRows={3}
					maxRows={10}
				/>
				{renderMentionPopup}
			</div>
			{renderSubmitButton()}
		</div>
	);
}
