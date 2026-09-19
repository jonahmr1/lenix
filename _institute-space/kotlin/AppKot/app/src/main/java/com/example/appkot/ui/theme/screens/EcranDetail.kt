package com.example.appkot.ui.theme.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.appkot.ui.theme.Models.Produit

@Composable
fun EcranDetail(produit: Produit) {
    Scaffold { innerPadding ->
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = produit.nom, style = MaterialTheme.typography.headlineMedium)
                Text(text = "Catégorie : ${produit.categorie}")
                Text(text = "Quantité : ${produit.quantite} ${produit.unite}")
            }
        }
    }
}

// add a separate preview function with fake data for testing
@Preview(showBackground = true, showSystemUi = true)
@Composable
fun EcranDetailTest() {
    EcranDetail(
        produit = Produit(
            id = 1,
            nom = "aapple",
            categorie = "fruits",
            quantite = 2,
            unite = "items"
        )
    )
}