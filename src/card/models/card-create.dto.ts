import { IsAlphanumeric, IsHexadecimal, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator";


export class CardCreateDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    value: string;

    @IsUUID()
    @IsOptional()
    owner?: string;
}