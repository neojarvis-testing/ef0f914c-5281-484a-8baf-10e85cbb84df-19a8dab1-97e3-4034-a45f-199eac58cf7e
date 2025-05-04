import { Internship } from "./internship.model";
import { User } from "./user.model";

export interface InternshipApplication
{
    internshipApplicationId?: number;
    userId: number;
    user? : User;
    intershipId: number;
    internship? : Internship;
    universityName: string;
    degreeProgram: string;
    resume: string;
    linkedInProfile?: string;
    applicationStatus: string;
    applicationDate: string;
}