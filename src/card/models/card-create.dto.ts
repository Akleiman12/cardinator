import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from "class-validator";


export class CardCreateDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    price: number;

    @IsUUID()
    @IsOptional()
    owner?: string;
}