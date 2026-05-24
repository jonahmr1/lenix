package com.example.queueapp

import androidx.lifecycle.ViewModel
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

class AppViewModel : ViewModel() {
    var currentTicket by mutableStateOf(0)
        private set

    fun takeTicket(): Int {
        currentTicket++
        return currentTicket
    }
}