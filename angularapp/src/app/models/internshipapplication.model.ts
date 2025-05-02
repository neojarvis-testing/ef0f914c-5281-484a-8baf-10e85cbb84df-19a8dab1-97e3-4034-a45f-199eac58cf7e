import { Internship } from "./internship.model";

export interface InternshipApplication
{
    InternshipApplicationId?: number;
    UserId: number;
    IntershipId: number;
    Intership? : Internship;
    UniversityName: string;
    DegreeProgram: string;
    Resume: string;
    LinkedInProfile?: string;
    ApplicationStatus: string;
    ApplicationDate: string;
}