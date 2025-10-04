import { Button } from "@/components/ui/button";
// import { AppWindowIcon, CodeIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyRegForm from "./company-reg-form";

type Props = {
	onBack: () => void;
};

const MainCompanyForm = ({ onBack }: Props) => {
	return (
		<div className="w-full flex items-center justify-center">
			<div className="w-full max-w-lg sm:max-w-xl lg:max-w-3xl flex flex-col gap-6">
				<Tabs defaultValue="account">
					<TabsList className="w-full flex flex-wrap justify-center gap-2 mb-2">
						<TabsTrigger value="account">Perusahaan</TabsTrigger>
						<TabsTrigger value="password">Pegawai</TabsTrigger>
					</TabsList>
					<TabsContent value="account">
						<Card>
							<CardHeader>
								<CardTitle>Akun Perusahaan (Owner)</CardTitle>
								<CardDescription>
									Akun yang didaftarkan dibawah akan otomatis memiliki role
									owner.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4">
								<CompanyRegForm />
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="password">
						<Card>
							<CardHeader>
								<CardTitle>Password</CardTitle>
								<CardDescription>
									Change your password here. After saving, you&apos;ll be logged
									out.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-6">
								<div className="grid gap-3">
									<Label htmlFor="tabs-demo-current">Current password</Label>
									<Input id="tabs-demo-current" type="password" />
								</div>
								<div className="grid gap-3">
									<Label htmlFor="tabs-demo-new">New password</Label>
									<Input id="tabs-demo-new" type="password" />
								</div>
							</CardContent>
							<CardFooter>
								<Button>Save changes</Button>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>

				<div className="flex gap-4 justify-start">
					<Button variant="outline" onClick={onBack}>
						Kembali
					</Button>
				</div>
			</div>
		</div>
	);
};

export default MainCompanyForm;
