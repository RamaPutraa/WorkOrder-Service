

export const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="text-black border-t border-border">
			<div className="w-full mx-auto px-6 pt-12 pb-8">
				{/* Bottom bar */}
				<div className="flex items-center justify-center gap-3 text-sm text-gray-500">
					<p>© {currentYear} Work Order</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
