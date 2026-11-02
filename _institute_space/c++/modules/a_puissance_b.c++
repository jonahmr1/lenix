#include <iostream>
using namespace std;

int main () {
    int i, a, b, p = 1;
    cout << "Entre a: ";
    cin >> a;
    cout << "Entre b: ";
    cin >> b;
    for (i = 1; i <= b; i++) {
        p *= a;
    }
    cout << "Le resultat est: " << p << "\n";
}