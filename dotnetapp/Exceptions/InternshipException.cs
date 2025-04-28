using System;
using dotnetapp.Exceptions;

namespace dotnetapp.Exceptions
{
    public class InternshipException : Exception
    {
         public InternshipException(string message) : base(message)
         {

         }

    }
}