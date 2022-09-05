import { Multiselect } from "./Multiselect";
import { ComponentMeta } from "@storybook/react";
import { useState } from "react";
import { VStack } from "@chakra-ui/react";

export default {
	title: "Multiselect",
	component: Multiselect,
} as ComponentMeta<typeof Multiselect>;

export const Example = () => {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [allOptions, setAllOptions] = useState<string[]>([
		"yo homeboy",
		"home, sweet home",
	]);

	return (
		<VStack align="flex-start">
			<Multiselect
				allOptions={allOptions}
				selectedOptions={selectedOptions}
				onChange={(vals) => {
					setSelectedOptions(vals);
					setAllOptions((prevs) => Array.from(new Set([...prevs, ...vals])));
				}}
			/>
		</VStack>
	);
};
