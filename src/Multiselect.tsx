import {
	Input,
	Box,
	Flex,
	FlexboxProps,
	ScaleFade,
	useOutsideClick,
	Wrap,
	WrapItem,
	forwardRef,
	useMergeRefs,
} from "@chakra-ui/react";
import { useEffect, useReducer, useRef } from "react";
import useMeasure from "use-measure";
import { FlexColumn } from "./FlexColumn";
import { Option } from "./Option";
import { OptionsFooter } from "./OptionsFooter";
import { SelectedOption } from "./SelectedOption";
export type DisplayingOption = string;

export type MultiselectState = {
	state: "clicked" | "unClicked";
	textValue: string;
	selectedOptions: string[];
	displayingOptions: DisplayingOption[];
	allOptions: string[];
};

export type MultiselectAction =
	| { type: "click" }
	| { type: "unClick" }
	| { type: "textChange"; value: string }
	| { type: "createNew" }
	| { type: "selectedOptionsChange"; value: string[] }
	| { type: "allOptionsChange"; value: string[] };

const emptyState: MultiselectState = {
	state: "unClicked",
	textValue: "",
	selectedOptions: [],
	displayingOptions: [],
	allOptions: [],
};

const reducer = (
	state: MultiselectState,
	action: MultiselectAction
): MultiselectState => {
	switch (state.state) {
		case "clicked": {
			switch (action.type) {
				case "unClick": {
					return { ...state, textValue: "", state: "unClicked" };
				}
				case "textChange": {
					const { value } = action;
					const token = value.toLocaleLowerCase().trim();
					const displayingOptions = state.allOptions
						.filter((option) => option.toLocaleLowerCase().includes(token))
						.filter((option) => !state.selectedOptions.includes(option))
						.sort((a, b) => a.indexOf(token) - b.indexOf(token));
					return {
						...state,
						textValue: action.value,
						displayingOptions,
					};
				}
				case "selectedOptionsChange": {
					const { value: selectedOptions } = action;
					const displayingOptions = state.allOptions.filter(
						(option) => !selectedOptions.includes(option)
					);

					return {
						...state,
						displayingOptions,
						selectedOptions,
					};
				}
				case "createNew": {
					return {
						...state,
						textValue: "",
						state: "unClicked",
					};
				}
				case "allOptionsChange": {
					return {
						...state,
						allOptions: action.value,
					};
				}
				default: {
					return state;
				}
			}
		}
		case "unClicked": {
			switch (action.type) {
				case "click": {
					return { ...state, state: "clicked" };
				}
				case "selectedOptionsChange": {
					const { value: selectedOptions } = action;
					const displayingOptions = state.allOptions.filter(
						(option) => !selectedOptions.includes(option)
					);

					return {
						...state,
						displayingOptions,
						selectedOptions,
					};
				}
				default: {
					return state;
				}
			}
		}
	}
};

export type MultiselectProps = FlexboxProps & {
	allOptions: string[];
	selectedOptions: string[];
	onChange: (selectedOptions: string[]) => void;
};

export const createInitState = (
	allOptions: MultiselectProps["allOptions"],
	selectedOptions: MultiselectProps["selectedOptions"]
): MultiselectState => ({
	...emptyState,
	allOptions,
	selectedOptions,
	displayingOptions: allOptions,
});

export const Multiselect = forwardRef(
	(
		{ allOptions, selectedOptions, onChange, ...rest }: MultiselectProps,
		externalRef
	) => {
		const ref = useRef<HTMLDivElement>(null);
		const refs = useMergeRefs(ref, externalRef);
		const inputRef = useRef<HTMLInputElement>(null);

		const [state, dispatch] = useReducer(
			reducer,
			createInitState(allOptions, selectedOptions)
		);

		useOutsideClick({ ref, handler: () => dispatch({ type: "unClick" }) });

		// Sync external and internal state
		useEffect(() => {
			dispatch({ type: "allOptionsChange", value: allOptions });
			dispatch({ type: "selectedOptionsChange", value: selectedOptions });
		}, [selectedOptions, allOptions]);

		// Unfortunately useDimensions from ChakraUI didn't work here
		// although I tried
		const dimensions = useMeasure(ref);

		return (
			<Flex position="relative" ref={refs} {...rest}>
				<Box
					w="302px"
					h="fit-content"
					bg="white"
					border="1px solid"
					borderColor="gray.200"
					borderRadius="6px"
					p={2}
					onClick={() => inputRef.current?.focus()}
				>
					<Wrap h="full">
						{state.selectedOptions.map((option) => (
							<WrapItem key={option}>
								<SelectedOption
									value={option}
									onDeselect={() => {
										onChange(state.selectedOptions.filter((o) => o !== option));
									}}
								/>
							</WrapItem>
						))}
					</Wrap>
					<Input
						ref={inputRef}
						variant={"unstyled"}
						w="300px"
						value={state.textValue}
						onChange={(e) =>
							dispatch({ type: "textChange", value: e.target.value })
						}
						onFocus={() => dispatch({ type: "click" })}
					/>
				</Box>
				<Box
					position="absolute"
					top={`${(dimensions?.height ?? 0) + 8}px`}
					zIndex={100}
				>
					<ScaleFade in={state.state === "clicked"} unmountOnExit>
						<FlexColumn
							w="400px"
							minH="40px"
							bg="white"
							border="1px solid"
							borderColor="gray.200"
							borderRadius="6px"
							p={2}
							shadow="md"
						>
							<FlexColumn maxH="600px" overflow="auto">
								{state.displayingOptions.map((option) => (
									<Option
										onOptionSelect={(value) => {
											onChange([...state.selectedOptions, value]);
										}}
										key={option}
										textValue={option}
										// this "@@@" is a hack, so that initially all options
										// would get displayed
										query={state.textValue === "" ? "@@@" : state.textValue}
									/>
								))}
							</FlexColumn>
							<OptionsFooter
								displayingOptions={state.displayingOptions}
								textValue={state.textValue}
								onCreate={() => {
									if (state.textValue !== "") {
										dispatch({ type: "createNew" });
										onChange([...state.selectedOptions, state.textValue]);
										dispatch({ type: "unClick" });
										inputRef.current?.blur();
									}
								}}
							/>
						</FlexColumn>
					</ScaleFade>
				</Box>
			</Flex>
		);
	}
);
