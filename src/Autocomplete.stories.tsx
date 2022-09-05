import { Autocomplete } from "./Autocomplete";
import { ComponentMeta } from "@storybook/react";

export default {
	title: "Autocomplete",
	component: Autocomplete,
} as ComponentMeta<typeof Autocomplete>;

export const Example = () => <Autocomplete />;