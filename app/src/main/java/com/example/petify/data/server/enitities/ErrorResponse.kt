package com.example.petify.data.server.enitities

data class ErrorResponse (
    val status: String?,
    val error: String?
)

data class SuccessResponse (
    val success: Boolean = true,
    val message: String?
)