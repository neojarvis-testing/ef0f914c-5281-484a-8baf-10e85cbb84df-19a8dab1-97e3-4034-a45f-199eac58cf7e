using System;
using System.Collections.Generic;
using System.Linq;
using dotnetapp.Services;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class InternshipApplicationController : ControllerBase
    {
        private readonly InternshipApplicationService _internshipApplicationService;

        public InternshipApplicationController(InternshipApplicationService internshipApplicationService)
        {
            _internshipApplicationService = internshipApplicationService;
        }
         // 1. Retrieves all internship applications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InternshipApplication>>> GetAllInternshipApplications()
        {
            try
            {
                var applications = await _internshipApplicationService.GetAllInternshipApplications();
                return Ok(applications); // 200 OK response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // 500 Internal Server Error
            }
        }


        // 2. Retrieves internship applications by user ID
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<InternshipApplication>>> GetInternshipApplicationByUserId(int userId)
        {
            try
            {
                var applications = await _internshipApplicationService.GetInternshipApplicationsByUserId(userId);

                if (applications == null || !applications.Any())
                {
                    return NotFound("Cannot find any internship application"); // 404 Not Found
                }

                return Ok(applications); // 200 OK response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // 500 Internal Server Error
            }
        }

        // 3. Adds a new internship application
        [HttpPost]
        public async Task<ActionResult> AddInternshipApplication([FromBody] InternshipApplication internshipApplication)
        {
            try
            {
                var success = await _internshipApplicationService.AddInternshipApplication(internshipApplication);

                if (success)
                {
                    return Ok("Internship application added successfully"); // 200 OK response
                }

                return BadRequest("Failed to add internship application"); // 400 Bad Request
            }
             catch (InternshipException iex)
            {
                return BadRequest(iex.Message); // 400 Bad Request for application-specific exceptions
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // 500 Internal Server Error
            }
        }

        // 4. Updates an existing internship application
        [HttpPut("{internshipApplicationId}")]
        public async Task<ActionResult> UpdateInternshipApplication(int internshipApplicationId, [FromBody] InternshipApplication internshipApplication)
        {
            try
            {
                var success = await _internshipApplicationService.UpdateInternshipApplication(internshipApplicationId, internshipApplication);

                if (success)
                {
                    return Ok("Internship application updated successfully"); // 200 OK response
                }

                return NotFound("Cannot find any internship application"); // 404 Not Found
            }

            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // 500 Internal Server Error
            }
        }

        // 5. Deletes an internship application by ID
        [HttpDelete("{internshipApplicationId}")]
        public async Task<ActionResult> DeleteInternshipApplication(int internshipApplicationId)
        {
            try
            {
                var success = await _internshipApplicationService.DeleteInternshipApplication(internshipApplicationId);

                if (success)
                {
                    return Ok("Internship application deleted successfully"); // 200 OK response
                }
                 return NotFound("Cannot find any internship application"); // 404 Not Found
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}"); // 500 Internal Server Error
            }
        }

    }
}