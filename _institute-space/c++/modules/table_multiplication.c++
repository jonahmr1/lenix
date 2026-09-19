#include <iostream>
using namespace std;

int main() {
    int n, r;
    cout << "Entre un nombre: ";
    cin >> n;
    for (int i = 1; i <= 10; i++) {
        r = i * n;
        cout << n << " x " << i << " = " << r << endl;
    }
    return 0;
}