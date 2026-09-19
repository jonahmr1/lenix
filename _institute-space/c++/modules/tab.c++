# include <iostream>

using namespace std;

int main() {
    int longeur, i;
    cout << "Entre la longeur de tableau: ";
    cin >> longeur;
    int tab[longeur] = {};
    for (i = 0; i < longeur; i++) {
        cout << "element " << i + 1 << ": ";
        cin >> tab[i];
    }
    cout << "Tableau: [";
    for (int j = 0; j < i; j++) {
        cout << tab[j] << ", ";
    }
    cout << "]";
    return 0;
}