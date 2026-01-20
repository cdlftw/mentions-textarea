// useMentionPosition.ts
import * as React from "react";

function findAtIndexForCurrentWord(text: string, caret: number) {
	// Look backwards from caret to the word start
	let start = caret - 1;
	while (start >= 0 && !/\s/.test(text[start])) start--;
	start++; // move to first char of the word

	const atPos = text.lastIndexOf("@", caret - 1);
	if (atPos >= start) {
		// ensure it's the same token and not an email mid-word if you want
		return atPos;
	}
	return -1;
}

export function useMentionPosition(
	textareaRef: React.RefObject<HTMLTextAreaElement>
) {
	const [popupPos, setPopupPos] = React.useState<{
		top: number;
		left: number;
	} | null>(null);
	const [query, setQuery] = React.useState("");

	const update = React.useCallback(() => {
		const ta = textareaRef.current;
		if (!ta) return;

		const caret = ta.selectionStart ?? 0;
		const value = ta.value;
		const atIndex = findAtIndexForCurrentWord(value, caret);

		if (atIndex === -1) {
			setPopupPos(null);
			setQuery("");
			return;
		}

		// Optional: only open when there’s at least "@" (length >= 1)
		const currentWord = value.slice(atIndex + 1, caret);
		// If you want to close when space/newline typed after "@"
		if (/\s/.test(currentWord)) {
			setPopupPos(null);
			setQuery("");
			return;
		}

		const rect = getCaretClientRectForIndex(ta, atIndex);
		if (!rect) {
			setPopupPos(null);
			setQuery("");
			return;
		}

		// Position *below* the '@'
		setPopupPos({
			top: rect.bottom + 4 + window.scrollY,
			left: rect.left + window.scrollX,
		});
		setQuery(currentWord);
	}, [textareaRef]);

	return { popupPos, query, update, clear: () => setPopupPos(null) };
}

export function getCaretClientRectForIndex(
	textarea: HTMLTextAreaElement,
	index: number
) {
	const style = window.getComputedStyle(textarea);

	// Mirror div
	const div = document.createElement("div");
	document.body.appendChild(div);

	const propertiesToCopy = [
		"boxSizing",
		"width",
		"height",
		"overflowX",
		"overflowY",
		"borderLeftWidth",
		"borderRightWidth",
		"borderTopWidth",
		"borderBottomWidth",
		"paddingTop",
		"paddingRight",
		"paddingBottom",
		"paddingLeft",
		"fontStyle",
		"fontVariant",
		"fontWeight",
		"fontStretch",
		"fontSize",
		"fontSizeAdjust",
		"lineHeight",
		"fontFamily",
		"textAlign",
		"textTransform",
		"textIndent",
		"textDecoration",
		"letterSpacing",
		"wordSpacing",
		"tabSize",
		"MozTabSize",
		"whiteSpace",
	] as const;

	div.style.position = "absolute";
	div.style.visibility = "hidden";
	div.style.whiteSpace = "pre-wrap"; // important: match wrapping
	div.style.wordWrap = "break-word";
	div.style.overflow = "hidden";

	// Copy computed styles
	propertiesToCopy.forEach((prop) => {
		div.style[prop] = style[prop];
	});

	// The mirror must have the same width as the *inner* content box
	const rect = textarea.getBoundingClientRect();
	const borderX =
		parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
	div.style.width = rect.width - borderX + "px";

	// Account for scroll
	div.scrollTop = textarea.scrollTop;
	div.scrollLeft = textarea.scrollLeft;

	// Build content with a marker at `index`
	const value = textarea.value;
	const before = value.substring(0, index);
	const after = value.substring(index);

	// Convert special chars to HTML and preserve spaces/newlines
	const esc = (s: string) =>
		s
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/\n/g, "<br/>")
			.replace(/ {2}/g, " &nbsp;"); // preserve double spaces

	div.innerHTML = `${esc(before)}<span id="caret-marker">|</span>${esc(
		after
	)}`;

	// Position the mirror exactly over the textarea’s content box
	const taRect = textarea.getBoundingClientRect();
	div.style.left = `${taRect.left + window.scrollX}px`;
	div.style.top = `${taRect.top + window.scrollY}px`;
	div.style.zIndex = "-1"; // keep it out of the way

	const marker = div.querySelector("#caret-marker") as HTMLSpanElement | null;
	const markerRect = marker?.getBoundingClientRect();

	// Cleanup
	div.parentNode?.removeChild(div);

	if (!markerRect) return null;

	// Return viewport coords; caller can convert to page with scroll if needed
	return {
		top: markerRect.top,
		left: markerRect.left,
		bottom: markerRect.bottom,
		right: markerRect.right,
		height: markerRect.height,
		width: markerRect.width,
	};
}
