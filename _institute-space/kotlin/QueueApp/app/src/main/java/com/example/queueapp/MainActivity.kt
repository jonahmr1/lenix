package com.example.queueapp

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.queueapp.screens.HomeScreen
import com.example.queueapp.screens.QueueScreen
import com.example.queueapp.screens.TicketScreen

@Preview(showBackground = true)
@Composable
fun HomeTest(){
    HomeScreen()
}

@Preview(showBackground = true)
@Composable
fun TicketTest(){
    TicketScreen()
}
@Preview(showBackground = true)
@Composable
fun QueueTest(){
    QueueScreen()
}
