import { Tag, TagCloseButton, TagLabel, TagProps } from "@chakra-ui/react";

export type SelectedOptionProps = TagProps & {
	value: string;
	onDeselect: () => void;
};

export const SelectedOption = ({
	value,
	onDeselect,
	...rest
}: SelectedOptionProps) => {
	return (
		<Tag {...rest} variant="outline">
			<TagLabel>{value}</TagLabel>
			<TagCloseButton onClick={onDeselect} />
		</Tag>
	);
};
