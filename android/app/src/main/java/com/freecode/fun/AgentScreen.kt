package com.freecode.fun

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun AgentScreen(navController: NavController) {
    var messages by remember { mutableStateOf(listOf<Message>()) }
    var inputText by remember { mutableStateOf("") }
    var isAgentRunning by remember { mutableStateOf(false) }
    var currentTask by remember { mutableStateOf<String?>(null) }
    
    Column(modifier = Modifier.fillMaxSize()) {
        // Agent status bar
        Card(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            colors = CardDefaults.cardColors(
                containerColor = if (isAgentRunning) 
                    MaterialTheme.colorScheme.primaryContainer 
                else 
                    MaterialTheme.colorScheme.surface
            )
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = if (isAgentRunning) Icons.Default.PlayArrow else Icons.Default.Pause,
                    contentDescription = "Status",
                    tint = if (isAgentRunning) 
                        MaterialTheme.colorScheme.primary 
                    else 
                        MaterialTheme.colorScheme.onSurface
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = if (isAgentRunning) "Agent Running" else "Agent Ready",
                        style = MaterialTheme.typography.titleMedium
                    )
                    currentTask?.let { task ->
                        Text(
                            text = task,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
                if (isAgentRunning) {
                    Button(
                        onClick = { 
                            isAgentRunning = false
                            currentTask = null
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.error
                        )
                    ) {
                        Text("Stop")
                    }
                }
            }
        }
        
        // Messages
        LazyColumn(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(horizontal = 16.dp)
        ) {
            items(messages) { msg ->
                MessageBubble(msg)
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
        
        // Input
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            TextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Ask agent to code...") },
                enabled = !isAgentRunning
            )
            Spacer(modifier = Modifier.width(8.dp))
            Button(
                onClick = {
                    if (inputText.isNotBlank() && !isAgentRunning) {
                        messages = messages + Message("user", inputText)
                        currentTask = inputText
                        isAgentRunning = true
                        inputText = ""
                        
                        // Simulate agent response
                        messages = messages + Message("assistant", "🤖 Agent started: $currentTask")
                    }
                },
                enabled = !isAgentRunning && inputText.isNotBlank()
            ) {
                Text("Run")
            }
        }
    }
}
