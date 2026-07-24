#include <stdio.h>

void remplirTableau(int tab[], int n) {
    printf("Entrez %d elements du tableau:\n", n);
    for (int i = 0; i < n; i++) {
        printf("Element %d: ", i + 1);
        scanf("%d", &tab[i]);
    }
}

void afficherInverse(int tab[], int n) {
    printf("\nLe tableau en ordre inverse:\n");
    for (int i = n - 1; i >= 0; i--) {
        printf("%d ", tab[i]);
    }
    printf("\n");
}

int main() {
    int n;
    printf("Entrez la taille du tableau: ");
    scanf("%d", &n);
    
    int tab[n];
    
    remplirTableau(tab, n);
    afficherInverse(tab, n);
    
    return 0;
}
