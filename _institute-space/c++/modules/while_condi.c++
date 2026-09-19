#include <iostream>
using namespace std;

int main () {
    int i = 1, s = 0, n;
    cout << "Entre un nombre: ";
    cin >> n;
    while (i <= n) {
        s = i + s;
        i++;
    }
    cout << "La somme des " << n << " premiers entiers est: " << s << "\n";
    return 0;
}