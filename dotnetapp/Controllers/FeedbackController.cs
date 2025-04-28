using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace dotnetapp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;

        // Constructor: Initializes the controller with an instance of FeedbackService.
        // This allows the controller to interact with the database and perform CRUD operations on feedback.
        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }

        // Retrieves all feedback records from the database.
        // This endpoint allows users or admins to view all feedback provided by different users.
        // If an error occurs during retrieval, it returns a 500 Internal Server Error.
        [HttpGet("GetAllFeedbacks")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacks(); // Fetch all feedback entries
                return Ok(feedbacks); // Return 200 OK response with feedback list
            }
            catch (Exception ex)
            {
                // If an error occurs, return 500 with exception message.
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // Retrieves feedback entries based on a specific user ID.
        // This endpoint is useful when displaying feedbacks provided by a particular user.
        // If an error occurs during retrieval, it returns a 500 Internal Server Error.
        [HttpGet("GetFeedbacksByUserId/{userId}")]
        public async Task<ActionResult<IEnumerable<Feedback>>> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetFeedbacksByUserId(userId); // Fetch feedbacks specific to a user
                return Ok(feedbacks); // Return 200 OK with feedbacks list
            }
            catch (Exception ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // Allows a user to submit feedback about an internship, application experience, or platform usage.
        // Receives feedback data from the request body and validates it before adding it to the database.
        // If successful, returns 200 OK with a success message.
        // If an error occurs during submission, it returns a 500 Internal Server Error.
        [HttpPost("AddFeedback")]
        public async Task<ActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {
                var success = await _feedbackService.AddFeedback(feedback); // Attempt to add feedback entry
                if (success)
                    return Ok("Feedback added successfully"); // Return success response

                return BadRequest("Invalid feedback data provided."); // Return 400 Bad Request for invalid input
            }
            catch (Exception ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // Deletes a feedback entry based on its unique ID.
        // This endpoint allows users or admins to remove inappropriate or outdated feedback.
        // If the feedback entry exists, it is deleted, and a 200 OK response is returned.
        // If no matching feedback is found, it returns a 404 Not Found.
        // If an error occurs, it returns a 500 Internal Server Error.
        [HttpDelete("DeleteFeedback/{feedbackId}")]
        public async Task<ActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var success = await _feedbackService.DeleteFeedback(feedbackId); // Attempt to delete feedback entry
                if (success)
                    return Ok("Feedback deleted successfully"); // Return success response

                return NotFound("Cannot find any feedback."); // Return 404 if feedback entry is not found
            }
            catch (Exception ex)
            {
                // Return 500 Internal Server Error if an exception occurs
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}