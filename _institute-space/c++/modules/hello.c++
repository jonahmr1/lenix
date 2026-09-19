# include <iostream>

using namespace std;

int main() {
    double a;
    cout << "Entre un chiffre: ";
    cin >> a;
    if (a > 0) {
        cout << "Le chiffre '" << a << "' est positif";
    } else {
        if (a < 0) {
            cout << "Le chiffre '" << a << "' est negatif";
        } else {
            cout << "Le chiffre '" << a << "' est nul";
        }
    }
    return 0;
}