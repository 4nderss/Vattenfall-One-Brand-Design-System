import React from "react";
import ReactMarkdown from "react-markdown";
import Heading from "./headingRenderer";
import Code from "./codeRenderer"
import styles from "./index.scss";

/*
module.exports = {
  break: 'br',
  paragraph: 'p',
  emphasis: 'em',
  strong: 'strong',
  thematicBreak: 'hr',
  blockquote: 'blockquote',
  delete: 'del',
  link: 'a',
  image: 'img',
  linkReference: 'a',
  imageReference: 'img',
  table: SimpleRenderer.bind(null, 'table'),
  tableHead: SimpleRenderer.bind(null, 'thead'),
  tableBody: SimpleRenderer.bind(null, 'tbody'),
  tableRow: SimpleRenderer.bind(null, 'tr'),
  tableCell: TableCell,
  root: Root,
  text: TextRenderer,
  list: List,
  listItem: ListItem,
  definition: NullRenderer,
  heading: Heading,
  inlineCode: InlineCode,
  code: CodeBlock,
  html: Html,
  virtualHtml: VirtualHtml,
  parsedHtml: ParsedHtml
}; */
import { useEffect } from 'react';
import TableOfContents from "../tableOfContents";

const useScript = url => {
	useEffect(() => {
		const script = document.createElement('script');

		script.src = url;
		script.async = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		}
	}, [url]);
};

const rootRenderer = ({children}) => {
	// Extract all toc content.
	const TOCLines = children.reduce((acc, { key, props }) => {
		// Skip non-headings
		if (key.indexOf('heading') !== 0) {
			return acc;
		}

		// Indent by two spaces per heading level after h1
		let indent = '';
		for (let idx = 1; idx < props.level; idx++) {
			indent = `${indent}  `;
		}

		return acc.concat(props.children);
	}, []);

	return (
		<React.Fragment>
			<TableOfContents content={TOCLines}/>
			{children}
		</React.Fragment>
	);
};

const Markdown = ({source}) => {
	// Reload js.
	useScript("/js/horizon.min.js");
	return (
		<div className={`${styles.container} ${"markdown-body"}` }>
			<ReactMarkdown
				source={source}
				renderers={{heading: Heading, code: Code, root: rootRenderer}}
			/>
		</div>
	);
};

export default Markdown;