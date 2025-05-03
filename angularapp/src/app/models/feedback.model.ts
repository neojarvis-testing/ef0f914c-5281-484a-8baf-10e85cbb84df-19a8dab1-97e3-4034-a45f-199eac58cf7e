import { User } from "./user.model";

export class Feedback {
    feedbackId?: number;
    userId?: number;
    user?: User;
    feedbackText: string;
    date: Date;
}