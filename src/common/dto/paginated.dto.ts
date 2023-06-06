import { IsNumber, IsOptional, IsPositive, Min} from "class-validator";

export class PaginatedDto{

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit?:number;

    @IsOptional()
    @IsNumber()
    offset?:number;
}