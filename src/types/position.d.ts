import type { ApiResponse } from "@/lib/api";
import type { Position } from "./entity";

export type GetPositionsResponse = ApiResponse<{
	positions: Position[];
}>;
