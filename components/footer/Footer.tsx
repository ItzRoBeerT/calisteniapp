export default function Footer() {
	const currentYear = new Date().getFullYear();
	//#TODO: Add the current year to the footer

	return (
		<footer className="bg-background bottom-0 px-4 py-2 mt-12 w-full flex justify-between">
			<span className="text-sm">Made with love by Us</span>
			<span className="text-sm">Copyright ©{currentYear}</span>
		</footer>
	);
}
