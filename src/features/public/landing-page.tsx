import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingPage = () => {
	return (
		<>
			<Button>
				<Link to="/company-regis">Company regis</Link>
			</Button>{" "}
			<br />
			<Button className="mt-5">
				<Link to="/dashboard/client">Create Work Order</Link>
			</Button>
		</>
	);
};

export default LandingPage;
