package com.freecode.fun.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

data class ChatRequest(
    val prompt: String,
    val maxIterations: Int? = null
)

data class ChatResponse(
    val success: Boolean,
    val output: String,
    val error: String? = null,
    val filesChanged: List<String> = emptyList(),
    val iterations: Int = 0,
    val duration: Long = 0
)

data class Tool(
    val name: String,
    val description: String,
    val parameters: Map<String, Any>
)

interface FreecodeFunApi {
    @GET("agent/tools")
    suspend fun getTools(): Response<Map<String, List<Tool>>>
    
    @POST("agent/execute")
    suspend fun executeTask(@Body request: ChatRequest): Response<ChatResponse>
    
    @GET("health")
    suspend fun health(): Response<Map<String, String>>
}
