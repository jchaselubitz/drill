export type RecordButtonStateType = 'recording' | 'transcribing' | 'disabled' | 'idle';

export type ActionButtonType = {
	show: boolean;
	isLoading: boolean;
	text: string;
	onClick: () => void;
};
