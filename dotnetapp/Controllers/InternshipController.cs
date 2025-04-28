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

        // Constructor: Initializes the controller with an instance of InternshipService.
        // This allows the controller to interact with the database and perform CRUD operations on internships.
        public InternshipController(InternshipService internshipService)
        {
            _internshipService = internshipService;
        }

        // Retrieves all internship records from the database.
        // This endpoint allows users or admins to view all internship entries.
        // If an error occurs during retrieval, it returns a 500 Internal Server Error.
        [HttpGet("GetAllInternships")]
        public async Task<ActionResult<IEnumerable<Internship>>> GetAllInternships()
        {
            try
            {
                var internships = await _internshipService.GetAllInternships(); // Fetch all internship entries
                return Ok(internships); // Return 200 OK response with internship list
            }
            catch (InternshipException ex)
            {
                // If an error occurs, return 500 with exception message.
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Retrieves an internship entry by its unique ID.
        // This endpoint allows users or admins to view details of a specific internship.
        // If the internship is not found, it returns a 404 Not Found response.
        // If an error occurs during retrieval, it returns a 500 Internal Server Error.
        [HttpGet("GetInternshipById/{internshipId}")]
        public async Task<ActionResult<Internship>> GetInternshipById(int internshipId)
        {
            try
            {
                var internship = await _internshipService.GetInternshipById(internshipId); // Fetch internship by ID
                if (internship == null)
                    return NotFound("Cannot find any internship"); // Return 404 if internship is not found

                return Ok(internship); // Return 200 OK response with internship data
            }
            catch (InternshipException ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Allows a user to add a new internship entry to the database.
        // Receives internship data from the request body and validates it before adding to the database.
        // If successful, returns 200 OK with a success message.
        // If an error occurs during submission, it returns a 500 Internal Server Error.
        [HttpPost("AddInternship")]
        public async Task<ActionResult> AddInternship([FromBody] Internship internship)
        {
            try
            {
                var success = await _internshipService.AddInternship(internship); // Attempt to add internship entry
                if (success)
                    return Ok("Internship added successfully"); // Return success response

                return BadRequest("Company with the same name already exists."); // Return 400 for duplicate entries
            }
            catch (InternshipException ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Updates an existing internship entry by its unique ID.
        // Receives the internship ID and updated internship data in the request body.
        // If the internship is not found, it returns a 404 Not Found response.
        // If successful, returns 200 OK with a success message.
        // If an error occurs during update, it returns a 500 Internal Server Error.
        [HttpPut("UpdateInternship/{internshipId}")]
        public async Task<ActionResult> UpdateInternship(int internshipId, [FromBody] Internship internship)
        {
            try
            {
                var success = await _internshipService.UpdateInternship(internshipId, internship); // Attempt to update internship
                if (success)
                    return Ok("Internship updated successfully"); // Return success response

                return NotFound("Cannot find any internship"); // Return 404 if internship is not found
            }
            catch (InternshipException ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Deletes an internship entry by its unique ID.
        // This endpoint allows users or admins to remove outdated or inappropriate internships.
        // If the internship exists, it is deleted, and a 200 OK response is returned.
        // If the internship is not found, it returns a 404 Not Found.
        // If an error occurs, it returns a 500 Internal Server Error.
        [HttpDelete("DeleteInternship/{internshipId}")]
        public async Task<ActionResult> DeleteInternship(int internshipId)
        {
            try
            {
                var success = await _internshipService.DeleteInternship(internshipId); // Attempt to delete internship
                if (success)
                    return Ok("Internship deleted successfully"); // Return success response

                return NotFound("Cannot find any internship"); // Return 404 if internship is not found
            }
            catch (InternshipException ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
