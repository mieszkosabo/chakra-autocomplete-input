import {
	Flex,
	FlexProps,
	Mark,
	Text,
	Tooltip,
	useHighlight,
} from "@chakra-ui/react";

// yep, this is a a hack, but yolo
const TRUNCATE_TRESHOLD = 40;

export type OptionProps = FlexProps & {
	textValue: string;
	query: string;
	onOptionSelect: (value: string) => void;
};

export const Option = ({
	textValue,
	query,
	onOptionSelect,
	...rest
}: OptionProps) => {
	const chunks = useHighlight({
		text: textValue,
		query,
	});

	const components = chunks.map(({ match, text }, idx) => {
		if (!match) {
			return text;
		} else {
			return (
				<Mark key={idx} bg="#FEEBC8">
					{text}
				</Mark>
			);
		}
	});

	return (
		<Flex
			{...rest}
			p={2}
			cursor="pointer"
			_hover={{
				bg: "ming.50", // FIXME: transition
			}}
			onClick={() => onOptionSelect(textValue)}
		>
			{textValue.length >= TRUNCATE_TRESHOLD ? (
				<Tooltip
					bg="gray.400"
					label={textValue}
					color="white"
					placement="right"
				>
					<Text noOfLines={1}>{components}</Text>
				</Tooltip>
			) : (
				<Text noOfLines={1}>{components}</Text>
			)}
		</Flex>
	);
};
