import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<>
			<Button>
				<Link to="/company-regis">Company regis</Link>
			</Button>
		</>
	);
};

export default LandingPage;
