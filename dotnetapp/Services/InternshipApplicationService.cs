using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using dotnetapp.Exceptions;
using dotnetapp.Data;
using dotnetapp.Models;
using System.Threading.Tasks;

namespace dotnetapp.Services
{
    // Service class to manage internship applications, handling CRUD operation.
    public class InternshipApplicationService
    {
        public readonly  ApplicationDbContext _context;

        public InternshipApplicationService(ApplicationDbContext context)
         {
        _context = context;
         }

        public async Task<IEnumerable<InternshipApplication>> GetAllInternshipApplications()
         {
        return await _context.InternshipApplications.ToListAsync();
         }

       public async Task<IEnumerable<InternshipApplication>> GetInternshipApplicationsByUserId(int userId)
         {
       
        return await _context.InternshipApplications
            .Where(application=> application.UserId == userId)
            .ToListAsync();
         }

        // Adds a new internship application to the database after validating for duplicates.

         public async Task<bool> AddInternshipApplication(InternshipApplication internshipApplication)
         {
             // Check if the user has already applied for this internship.
                 var existingApplication = await _context.InternshipApplications
                .FirstOrDefaultAsync( application=> application.UserId == internshipApplication.UserId &&
                application.InternshipApplicationId == internshipApplication.InternshipApplicationId);

            if (existingApplication != null)
             {
                 throw new InternshipException("User already applied for this internship");
             }

             _context.InternshipApplications.Add(internshipApplication);
             await _context.SaveChangesAsync();
             return true;
        
         }    


         public async Task<bool> UpdateInternshipApplication(int internshipApplicationId, InternshipApplication internshipApplication)
         {
           // Find the existing application by its ID.
             var existingApplication = await _context.InternshipApplications
            .FirstOrDefaultAsync(application => application.InternshipApplicationId == internshipApplicationId);

             if (existingApplication == null)
             {
                return false;
             }
       
             existingApplication.UniversityName = internshipApplication.UniversityName;
             existingApplication.DegreeProgram = internshipApplication.DegreeProgram;
             existingApplication.Resume = internshipApplication.Resume;
             existingApplication.LinkedInProfile = internshipApplication.LinkedInProfile;
             existingApplication.ApplicationStatus = internshipApplication.ApplicationStatus;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteInternshipApplication(int internshipApplicationId)
        {
        // Find the existing application by its ID.
        var existingApplication = await _context.InternshipApplications
            .FirstOrDefaultAsync(application => application.InternshipApplicationId == internshipApplicationId);

        if (existingApplication == null)
        {
            return false;
        }

        _context.InternshipApplications.Remove(existingApplication);
        await _context.SaveChangesAsync();
        return true;
   
        }










    }
}