package com.freecode.fun

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ModelsScreen(navController: NavController) {
    val models = remember {
        listOf(
            "kilo-auto/free",
            "openrouter/free",
            "DeepSeek-V4-Flash-0731",
            "gpt-oss:20b",
            "mistral-Nemo-Instruct-2407",
            "minimax-m2.7",
            "Qwen3-32B"
        )
    }
    
    var selectedModel by remember { mutableStateOf("auto") }
    
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Available Models", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Selected: $selectedModel",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn {
            items(models) { model ->
                Card(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                    onClick = { selectedModel = model },
                    colors = CardDefaults.cardColors(
                        containerColor = if (selectedModel == model) 
                            MaterialTheme.colorScheme.primaryContainer 
                        else 
                            MaterialTheme.colorScheme.surface
                    )
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedModel == model,
                            onClick = { selectedModel = model }
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = model,
                            style = MaterialTheme.typography.bodyLarge
                        )
                    }
                }
            }
        }
    }
}
