import type ApiResponse from "@/lib/api";
import type { Position } from "./entity";

export const GetPositionsResponse = ApiResponse<{
	positions: Position[];
}>;
