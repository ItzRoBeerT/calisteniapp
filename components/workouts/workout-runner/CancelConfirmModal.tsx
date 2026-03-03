type CancelConfirmModalProps = {
	onConfirm: () => void;
	onCancel: () => void;
	confirmText: string;
	yesText: string;
	noText: string;
};

export default function CancelConfirmModal({
	onConfirm,
	onCancel,
	confirmText,
	yesText,
	noText,
}: CancelConfirmModalProps) {
	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
			<div className="bg-surface rounded-xl p-6 max-w-sm w-full text-center">
				<p className="text-foreground text-lg font-medium mb-6">{confirmText}</p>
				<div className="flex gap-3 justify-center">
					<button
						onClick={onConfirm}
						className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
					>
						{yesText}
					</button>
					<button
						onClick={onCancel}
						className="bg-surface hover:bg-surface/80 text-foreground px-6 py-3 rounded-xl transition-colors border border-white/10"
					>
						{noText}
					</button>
				</div>
			</div>
		</div>
	);
}
