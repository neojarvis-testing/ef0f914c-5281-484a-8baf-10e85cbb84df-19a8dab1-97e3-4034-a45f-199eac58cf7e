using System.Reflection;
using log4net;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InternshipController : ControllerBase
    {
        private readonly InternshipService _internshipService;

        // Initializing Log4Net logger for logging purposes.
        private static readonly ILog log = LogManager.GetLogger(MethodBase.GetCurrentMethod()?.DeclaringType);

        // Constructor: Initializes the controller with an instance of InternshipService.
        public InternshipController(InternshipService internshipService)
        {
            _internshipService = internshipService;
        }

        // Retrieves all internship records from the database.
        [HttpGet("GetAllInternships")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetAllInternships()
        {
            log.Info("Fetching all internship records.");

            try
            {
                var internships = await _internshipService.GetAllInternships();
                log.Info($"Successfully retrieved {internships.Count()} internship records.");
                return Ok(internships);
            }
            catch (InternshipException ex)
            {
                log.Error($"Error fetching all internship records: {ex.Message}", ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Retrieves an internship entry by its unique ID.
        [HttpGet("GetInternshipById/{internshipId}")]
        public async Task<ActionResult<Internship>> GetInternshipById(int internshipId)
        {
            log.Info($"Fetching internship record for ID: {internshipId}");

            try
            {
                var internship = await _internshipService.GetInternshipById(internshipId);
                if (internship == null)
                {
                    log.Warn($"No internship found with ID: {internshipId}");
                    return NotFound("Cannot find any internship");
                }

                log.Info($"Successfully retrieved internship record for ID: {internshipId}");
                return Ok(internship);
            }
            catch (InternshipException ex)
            {
                log.Error($"Error fetching internship record for ID {internshipId}: {ex.Message}", ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Allows a user to add a new internship entry to the database.
        [HttpPost("AddInternship")]
        public async Task<ActionResult> AddInternship([FromBody] Internship internship)
        {
            log.Info("Attempting to add a new internship record.");

            try
            {
                var success = await _internshipService.AddInternship(internship);
                if (success)
                {
                    log.Info("Internship added successfully.");
                    return Ok("Internship added successfully");
                }

                log.Warn("Attempt to add a duplicate internship record.");
                return BadRequest("Company with the same name already exists.");
            }
            catch (InternshipException ex)
            {
                log.Error($"Error adding internship: {ex.Message}", ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Updates an existing internship entry by its unique ID.
        [HttpPut("UpdateInternship/{internshipId}")]
        public async Task<ActionResult> UpdateInternship(int internshipId, [FromBody] Internship internship)
        {
            log.Info($"Attempting to update internship record with ID: {internshipId}");

            try
            {
                var success = await _internshipService.UpdateInternship(internshipId, internship);
                if (success)
                {
                    log.Info($"Internship record with ID {internshipId} updated successfully.");
                    return Ok("Internship updated successfully");
                }

                log.Warn($"No internship found with ID: {internshipId}");
                return NotFound("Cannot find any internship");
            }
            catch (InternshipException ex)
            {
                log.Error($"Error updating internship with ID {internshipId}: {ex.Message}", ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Deletes an internship entry by its unique ID.
        [HttpDelete("DeleteInternship/{internshipId}")]
        public async Task<ActionResult> DeleteInternship(int internshipId)
        {
            log.Info($"Attempting to delete internship record with ID: {internshipId}");

            try
            {
                var success = await _internshipService.DeleteInternship(internshipId);
                if (success)
                {
                    log.Info($"Internship record with ID {internshipId} deleted successfully.");
                    return Ok("Internship deleted successfully");
                }

                log.Warn($"No internship found with ID: {internshipId}");
                return NotFound("Cannot find any internship");
            }
            catch (InternshipException ex)
            {
                log.Error($"Error deleting internship with ID {internshipId}: {ex.Message}", ex);
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
