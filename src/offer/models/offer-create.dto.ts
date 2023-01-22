import { IsInt, IsUUID, Min } from "class-validator";

export class OfferCreateDTO {
    @IsUUID()
    card: string;

    @IsInt()
    @Min(0)
    ammount: number;

}