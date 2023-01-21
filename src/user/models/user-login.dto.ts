import { IsString, IsAlphanumeric, IsHexadecimal, IsNotEmpty, Length } from "class-validator";

export class UserLoginDTO {
    @IsString()
    @IsAlphanumeric()
    @Length(5,50)
    username: string;

    @IsString()
    @IsAlphanumeric()
    @Length(8,12)
    password: string;
}