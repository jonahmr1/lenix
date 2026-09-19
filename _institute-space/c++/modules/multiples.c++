#include <iostream>

using namespace std;

int main() {
    char reponse = 'Y';
    
    while (reponse == 'Y' || reponse == 'y') {
        int n;
        cout << "Entre un chifre: ";
        cin >> n;
        if (n) {
            n *= n;
        };
        cout << "La resultat est: " << n << "\n";
        cout << "voulez vous continue? Entre 'Y' pour oui, et 'N' pour Non: ";
        cin >> reponse;
    }
    return 0;
}