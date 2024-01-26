export type RecordButtonStateType = 'recording' | 'transcribing' | 'idle';
export type ActionButtonType = {
	show: boolean;
	isLoading: boolean;
	text: string;
	onClick: () => void;
};
