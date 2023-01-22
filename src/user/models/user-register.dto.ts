import { IsString, IsAlphanumeric, IsHexadecimal, Length, IsInt, Min, IsOptional } from "class-validator";

export class UserRegisterDTO {
    @IsString()
    @IsAlphanumeric()
    @Length(5,50)
    username: string;

    @IsString()
    @IsHexadecimal()
    @Length(42,42) // 2 for '0x' and 40 for the actual hexadecimal number
    wallet: string;

    @IsString()
    @IsAlphanumeric()
    @Length(8,12)
    password: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    balance: number;
}