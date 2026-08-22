package com.freecode.fun

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                val navController = rememberNavController()
                var selectedItem by remember { mutableStateOf(0) }
                
                Scaffold(
                    bottomBar = {
                        NavigationBar {
                            NavigationBarItem(
                                selected = selectedItem == 0,
                                onClick = { 
                                    selectedItem = 0
                                    navController.navigate("chat") {
                                        popUpTo("chat") { inclusive = true }
                                    }
                                },
                                icon = { Icon(Icons.Default.Message, contentDescription = "Chat") },
                                label = { Text("Chat") }
                            )
                            NavigationBarItem(
                                selected = selectedItem == 1,
                                onClick = { 
                                    selectedItem = 1
                                    navController.navigate("models") {
                                        popUpTo("chat") { inclusive = true }
                                    }
                                },
                                icon = { Icon(Icons.Default.List, contentDescription = "Models") },
                                label = { Text("Models") }
                            )
                            NavigationBarItem(
                                selected = selectedItem == 2,
                                onClick = { 
                                    selectedItem = 2
                                    navController.navigate("agent") {
                                        popUpTo("chat") { inclusive = true }
                                    }
                                },
                                icon = { Icon(Icons.Default.PlayArrow, contentDescription = "Agent") },
                                label = { Text("Agent") }
                            )
                            NavigationBarItem(
                                selected = selectedItem == 3,
                                onClick = { 
                                    selectedItem = 3
                                    navController.navigate("settings") {
                                        popUpTo("chat") { inclusive = true }
                                    }
                                },
                                icon = { Icon(Icons.Default.Settings, contentDescription = "Settings") },
                                label = { Text("Settings") }
                            )
                        }
                    }
                ) { padding ->
                    NavHost(
                        navController = navController,
                        startDestination = "chat",
                        modifier = Modifier.padding(padding)
                    ) {
                        composable("chat") { ChatScreen(navController) }
                        composable("models") { ModelsScreen(navController) }
                        composable("agent") { AgentScreen(navController) }
                        composable("settings") { SettingsScreen(navController) }
                    }
                }
            }
        }
    }
}
