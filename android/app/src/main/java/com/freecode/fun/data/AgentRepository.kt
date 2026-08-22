package com.freecode.fun.data

import com.freecode.fun.api.ChatRequest
import com.freecode.fun.api.ChatResponse
import com.freecode.fun.api.FreecodeFunApi
import com.freecode.fun.api.Tool

class AgentRepository(private val api: FreecodeFunApi) {
    suspend fun getTools(): Result<List<Tool>> {
        return try {
            val response = api.getTools()
            if (response.isSuccessful) {
                val tools = response.body()?.get("tools") ?: emptyList()
                Result.success(tools)
            } else {
                Result.failure(Exception("Failed to load tools: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun executeTask(prompt: String): Result<ChatResponse> {
        return try {
            val response = api.executeTask(ChatRequest(prompt = prompt))
            if (response.isSuccessful) {
                val body = response.body()
                if (body != null) {
                    Result.success(body)
                } else {
                    Result.failure(Exception("Empty response"))
                }
            } else {
                Result.failure(Exception("Task failed: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun healthCheck(): Result<Boolean> {
        return try {
            val response = api.health()
            Result.success(response.isSuccessful)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
