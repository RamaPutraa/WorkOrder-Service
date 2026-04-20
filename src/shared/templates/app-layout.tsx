import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
// import AppSidebar from "../organism/sidebar";
// import { SidebarProvider } from "../../components/ui/sidebar";
import { AppSidebar } from "../organism/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { NavActions } from "../molecules/nav-actions";

const isIdSegment = (segment: string) => {
	// MongoDB ObjectId (24 hex characters)
	if (/^[0-9a-fA-F]{24}$/.test(segment)) return true;
	// UUID (8-4-4-4-12 hex characters)
	if (
		/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
			segment,
		)
	)
		return true;
	// Pure numeric IDs (e.g., standard SQL IDs, min 1 digit)
	if (/^\d+$/.test(segment) && segment.length >= 1) return true;

	return false;
};

const AppLayout = () => {
	const location = useLocation();
	const pathnames = location.pathname.split("/").filter((x) => x);

	// Filter out ID segments for visual representation, but keep their original cumulative path
	const mappedCrumbs = pathnames
		.map((value, index) => {
			const to = `/${pathnames.slice(0, index + 1).join("/")}`;
			return { value, to };
		})
		.filter((crumb) => !isIdSegment(crumb.value));

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								{mappedCrumbs.length === 0 ?
									<BreadcrumbItem>
										<BreadcrumbPage>Home</BreadcrumbPage>
									</BreadcrumbItem>
								:	mappedCrumbs.map((crumb, index) => {
										const isLast = index === mappedCrumbs.length - 1;
										const decodedValue = decodeURIComponent(crumb.value);
										const title =
											decodedValue.charAt(0).toUpperCase() +
											decodedValue.slice(1).replace(/-/g, " ");

										return (
											<React.Fragment key={crumb.to}>
												<BreadcrumbItem
													className={index === 0 ? "hidden md:block" : ""}>
													{isLast ?
														<BreadcrumbPage>{title}</BreadcrumbPage>
													:	<BreadcrumbLink asChild>
															<Link to={crumb.to}>{title}</Link>
														</BreadcrumbLink>
													}
												</BreadcrumbItem>
												{!isLast && (
													<BreadcrumbSeparator
														className={index === 0 ? "hidden md:block" : ""}
													/>
												)}
											</React.Fragment>
										);
									})
								}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="ml-auto px-3">
						<NavActions />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-10">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default AppLayout;
