package com.example.queueapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.queueapp.ui.theme.QueueAppTheme
import com.example.queueapp.ui.theme.screens.HomeScreen
import com.example.queueapp.ui.theme.screens.TicketScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            QueueAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    val viewModel: AppViewModel = viewModel()

                    NavHost(
                        navController = navController,
                        startDestination = "home"
                    ) {
                        composable("home") {
                            HomeScreen(
                                currentTicket = viewModel.currentTicket,
                                onTakeTicket = {
                                    val number = viewModel.takeTicket()
                                    navController.navigate("ticket/$number")
                                }
                            )
                        }
                        composable("ticket/{number}") { backStackEntry ->
                            val number = backStackEntry.arguments?.getString("number")?.toInt() ?: 0
                            TicketScreen(
                                ticketNumber = number,
                                onBack = { navController.popBackStack() }
                            )
                        }
                    }
                }
            }
        }
    }
}