import { Divider, Flex, FlexProps } from "@chakra-ui/react";
import { useEnter } from "../hooks/useEnter";
import { MultiselectState } from "../Multiselect";

type OptionsFooterProps = FlexProps & {
	textValue: MultiselectState["textValue"];
	displayingOptions: MultiselectState["displayingOptions"];
	onCreate: () => void;
};

export const OptionsFooter = ({
	textValue,
	displayingOptions,
	onCreate,
}: OptionsFooterProps) => {
	useEnter(onCreate);
	const isTextValueEmpty = textValue.trim() === "";
	const isTextValueInDisplayingOptions = displayingOptions.some(
		(value) =>
			value.toLocaleLowerCase() === textValue.toLocaleLowerCase().trim()
	);

	if (isTextValueInDisplayingOptions) {
		return null;
	}

	return (
		<>
			{displayingOptions.length > 0 && <Divider my={1} />}
			<Flex
				onClick={onCreate}
				color="gray.600"
				p={2}
				cursor={isTextValueEmpty ? undefined : "pointer"}
				_hover={
					isTextValueEmpty
						? undefined
						: {
								bg: "ming.50", // FIXME: transition
						  }
				}
			>
				{isTextValueEmpty ? (
					"startTyping"
				) : (
					<Flex>
						{"create"}
						<Flex
							outline="solid 1px"
							outlineColor="gray.200"
							borderRadius="6px"
							ml={2}
							px={1}
						>
							{textValue}
						</Flex>
					</Flex>
				)}
			</Flex>
		</>
	);
};
