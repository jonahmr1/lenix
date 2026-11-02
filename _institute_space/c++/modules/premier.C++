#include <iostream>
using namespace std;

int main () {
    int x, y, i;
    cout << "Entre un chiffre: ";
    cin >> y;
    for (i = 1; i <= y; i++) {
        if (y % i == 0) {
            x++;
        }
        cout << y;
    }
    return 0;
}