import { v4 } from 'uuid';
import { UserRegisterDTO } from './user-register.dto';

export class User {
    id: string;
    username: string;
    wallet: string;
    balance: number;
    password: string;
    createdAt: Date | string;

    constructor(props: User) {
        this.id = props.id;
        this.username = props.username;
        this.wallet = props.wallet;
        this.password = props.password;
        this.createdAt = props.createdAt;
    }

    static create(props: UserRegisterDTO) {
        return new User({
            id: v4(),
            username: props.username,
            wallet: props.wallet,
            balance: props.balance ? props.balance : 0,
            password: props.password,
            createdAt: new Date()
        });
    }
}