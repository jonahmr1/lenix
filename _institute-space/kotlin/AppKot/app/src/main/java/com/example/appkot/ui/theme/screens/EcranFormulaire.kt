package com.example.appkot.ui.theme.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

@Preview
@Composable
fun EcranFormulaire() {
    var nom by remember { mutableStateOf("") }
    var categorie by remember { mutableStateOf("") }
    var quantite by remember { mutableStateOf("") }
    var unite by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text("Ajouter un produit", style = MaterialTheme.typography.titleLarge)
        OutlinedTextField(value = nom, onValueChange = { nom = it }, label = { Text("Nom") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(value = categorie, onValueChange = { categorie = it }, label = { Text("Catégorie") }, modifier = Modifier.fillMaxWidth())
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(value = quantite, onValueChange = { quantite = it }, label = { Text("Quantité") }, modifier = Modifier.weight(1f))
            OutlinedTextField(value = unite, onValueChange = { unite = it }, label = { Text("Unité") }, modifier = Modifier.weight(1f))
        }
        Button(onClick = {}, modifier = Modifier.fillMaxWidth()) {
            Text("Ajouter")
        }
    }
}